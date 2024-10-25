import { CircularProgress, List, ListItem, ListItemIcon, ListItemText, Paper, SvgIcon, Typography } from '@mui/material'
import type { SafeTransaction } from '@safe-global/safe-core-sdk-types'
import useDecodeTx from '@/hooks/useDecodeTx'
import CheckIcon from '@/public/images/common/check.svg'
import CloseIcon from '@/public/images/common/close.svg'
import type { SafeNetSimulationResponse } from '@/store/safenet'
import { useLazySimulateSafeNetTxQuery } from '@/store/safenet'
import { useEffect, type ReactElement } from 'react'
import css from './styles.module.css'
import { hashTypedData } from '@/utils/web3'

export type SafeNetTxSimulationProps = {
  safe: string
  chainId: string
  safeTx?: SafeTransaction
}

function _getGuaranteeDisplayName(guarantee: string): string {
  switch (guarantee) {
    case 'no_delegatecall':
      return 'Fraud verification'
    case 'no_contract_recipient':
    case 'recipient_signature':
      return 'Recipient verification'
    default:
      return 'Other'
  }
}

function _groupResultGuarantees({
  results,
}: Pick<SafeNetSimulationResponse, 'results'>): { display: string; success: boolean }[] {
  const groups = results.reduce((groups, { guarantee, success }) => {
    const display = _getGuaranteeDisplayName(guarantee)
    return {
      ...groups,
      [display]: (groups[display] ?? true) && success,
    }
  }, {} as Record<string, boolean>)
  return Object.entries(groups)
    .map(([display, success]) => ({ display, success }))
    .sort((a, b) => a.display.localeCompare(b.display))
}

function _getSafeTxHash({ safe, chainId, safeTx }: Required<SafeNetTxSimulationProps>): string {
  return hashTypedData({
    domain: {
      chainId,
      verifyingContract: safe,
    },
    types: {
      SafeTx: [
        { type: 'address', name: 'to' },
        { type: 'uint256', name: 'value' },
        { type: 'bytes', name: 'data' },
        { type: 'uint8', name: 'operation' },
        { type: 'uint256', name: 'safeTxGas' },
        { type: 'uint256', name: 'baseGas' },
        { type: 'uint256', name: 'gasPrice' },
        { type: 'address', name: 'gasToken' },
        { type: 'address', name: 'refundReceiver' },
        { type: 'uint256', name: 'nonce' },
      ],
    },
    message: { ...safeTx.data },
  })
}

const SafeNetTxTxSimulationSummary = ({ simulation }: { simulation: SafeNetSimulationResponse }): ReactElement => {
  if (simulation.results.length === 0) {
    return <Typography>No SafeNet checks enabled...</Typography>
  }

  const guarantees = _groupResultGuarantees(simulation)

  return (
    <Paper variant="outlined" className={css.wrapper}>
      {simulation.hasError && (
        <Typography color="error" className={css.errorSummary}>
          One or more SafeNet checks failed!
        </Typography>
      )}

      <List>
        {guarantees.map(({ display, success }) => (
          <ListItem key={display}>
            <ListItemIcon>
              {success ? (
                <SvgIcon component={CheckIcon} inheritViewBox fontSize="small" color="success" />
              ) : (
                <SvgIcon component={CloseIcon} inheritViewBox fontSize="small" color="error" />
              )}
            </ListItemIcon>
            <ListItemText>{display}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export const SafeNetTxSimulation = ({ safe, chainId, safeTx }: SafeNetTxSimulationProps): ReactElement | null => {
  const [dataDecoded] = useDecodeTx(safeTx)
  const [simulate, { data: simulation, status }] = useLazySimulateSafeNetTxQuery()

  useEffect(() => {
    if (!safeTx || !dataDecoded) {
      return
    }

    const safeTxHash = _getSafeTxHash({ safe, chainId, safeTx })
    simulate({
      chainId,
      tx: {
        safe,
        safeTxHash,
        to: safeTx.data.to,
        value: safeTx.data.value,
        data: safeTx.data.data,
        operation: safeTx.data.operation,
        safeTxGas: safeTx.data.safeTxGas,
        baseGas: safeTx.data.baseGas,
        gasPrice: safeTx.data.gasPrice,
        gasToken: safeTx.data.gasToken,
        refundReceiver: safeTx.data.refundReceiver,
        // We don't send confirmations, as we want to simulate the transaction before signing.
        // In the future, we can consider sending the already collected signatures, but this is not
        // necessary at the moment.
        confirmations: [],
        dataDecoded,
      },
    })
  }, [safe, chainId, safeTx, dataDecoded, simulate])

  switch (status) {
    case 'fulfilled':
      return <SafeNetTxTxSimulationSummary simulation={simulation!} />
    case 'rejected':
      return (
        <Typography color="error">
          <SvgIcon component={CloseIcon} inheritViewBox fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Unexpected error simulating with SafeNet!
        </Typography>
      )
    default:
      return <CircularProgress size={22} sx={{ color: ({ palette }) => palette.text.secondary }} />
  }
}
