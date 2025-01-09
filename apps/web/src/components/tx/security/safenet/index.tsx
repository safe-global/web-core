import { Button, CircularProgress, List, ListItem, ListItemText, Paper, SvgIcon, Typography } from '@mui/material'
import type { SafeTransaction } from '@safe-global/safe-core-sdk-types'
import CopyTooltip from '@/components/common/CopyTooltip'
import useDecodeTx from '@/hooks/useDecodeTx'
import CheckIcon from '@/public/images/common/check.svg'
import CloseIcon from '@/public/images/common/close.svg'
import CopyIcon from '@/public/images/common/copy.svg'
import type { SafenetSimulationResponse } from '@/store/safenet'
import { useLazySimulateSafenetTxQuery } from '@/store/safenet'
import { hashTypedData } from '@/utils/web3'
import { useEffect, type ReactElement } from 'react'
import css from './styles.module.css'

export type SafenetTxSimulationProps = {
  safe: string
  chainId: string
  safeTx?: SafeTransaction
}

function _getGuaranteeDisplayName(guarantee: string): string {
  switch (guarantee) {
    case 'no_delegatecall':
    case 'no_contract_recipient': // We don't want to override the recipient verification
      return 'Fraud verification'
    case 'recipient_signature':
      return 'Recipient verification'
    default:
      return 'Other'
  }
}

function _groupResultGuarantees({
  results,
}: Pick<SafenetSimulationResponse, 'results'>): { display: string; status: string; link?: string }[] {
  const groups = results.reduce(
    (groups, { guarantee, status, metadata }) => {
      const display = _getGuaranteeDisplayName(guarantee)
      if (status === 'skipped') {
        return groups
      }
      return {
        ...groups,
        [display]: { status, link: metadata?.link },
      }
    },
    {} as Record<string, { status: string; link?: string }>,
  )
  return Object.entries(groups)
    .map(([display, { status, link }]) => ({ display, status, link }))
    .sort((a, b) => a.display.localeCompare(b.display))
}

function _getSafeTxHash({ safe, chainId, safeTx }: Required<SafenetTxSimulationProps>): string {
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

const StatusAction = ({ status, link }: { status: string; link?: string }): ReactElement => {
  if (status === 'success') {
    return (
      <div>
        <SvgIcon
          component={CheckIcon}
          inheritViewBox
          fontSize="small"
          color="success"
          className={css.safenetCheckIcon}
        />
        <span className={css.labelSuccess}>No issues found</span>
      </div>
    )
  } else if (status === 'pending' && link) {
    return (
      <CopyTooltip text={link}>
        <Button
          variant="outlined"
          size="small"
          sx={{ width: '100%', py: 0.5 }}
          startIcon={<SvgIcon component={CopyIcon} inheritViewBox fontSize="small" />}
        >
          Share verification link
        </Button>
      </CopyTooltip>
    )
  } else {
    return (
      <div>
        <SvgIcon component={CloseIcon} inheritViewBox fontSize="small" color="error" className={css.safenetCheckIcon} />
        <span className={css.labelFailure}>Failure</span>
      </div>
    )
  }
}

const SafenetTxTxSimulationSummary = ({ simulation }: { simulation: SafenetSimulationResponse }): ReactElement => {
  if (simulation.results.length === 0) {
    return <Typography>No Safenet checks enabled...</Typography>
  }

  const guarantees = _groupResultGuarantees(simulation)

  return (
    <Paper variant="outlined" className={css.wrapper}>
      {simulation.hasError && (
        <Typography color="error" className={css.errorSummary}>
          One or more Safenet checks failed!
        </Typography>
      )}

      <List>
        {guarantees.map(({ display, status, link }) => (
          <ListItem key={display} secondaryAction={<StatusAction status={status} link={link} />}>
            <ListItemText>{display}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export const SafenetTxSimulation = ({ safe, chainId, safeTx }: SafenetTxSimulationProps): ReactElement | null => {
  const [dataDecoded] = useDecodeTx(safeTx)
  const [simulate, { data: simulation, status }] = useLazySimulateSafenetTxQuery()

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
      return <SafenetTxTxSimulationSummary simulation={simulation!} />
    case 'rejected':
      return (
        <Typography color="error">
          <SvgIcon component={CloseIcon} inheritViewBox fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Unexpected error simulating with Safenet!
        </Typography>
      )
    default:
      return <CircularProgress size={22} sx={{ color: ({ palette }) => palette.text.secondary }} />
  }
}
