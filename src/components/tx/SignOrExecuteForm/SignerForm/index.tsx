import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
  type SelectChangeEvent,
} from '@mui/material'
import { useNestedSafeOwners } from '@/hooks/useNestedSafeOwners'
import { useWalletContext } from '@/hooks/wallets/useWallet'
import EthHashInfo from '@/components/common/EthHashInfo'
import { useCallback, useContext, useMemo } from 'react'
import useSafeInfo from '@/hooks/useSafeInfo'
import TxCard from '@/components/tx-flow/common/TxCard'
import InfoIcon from '@/public/images/notifications/info.svg'
import SignatureIcon from '@/public/images/transactions/signature.svg'

import css from './styles.module.css'
import { sameAddress } from '@/utils/addresses'
import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'
import { MODALS_EVENTS, trackEvent } from '@/services/analytics'
import { useIsNestedSafeOwner } from '@/hooks/useIsNestedSafeOwner'

export const SignerForm = ({ willExecute }: { willExecute?: boolean }) => {
  const { signer, setSignerAddress, connectedWallet: wallet } = useWalletContext() ?? {}
  const nestedSafeOwners = useNestedSafeOwners()
  const signerAddress = signer?.address
  const { safe } = useSafeInfo()
  const { safeTx } = useContext(SafeTxContext)
  const isNestedOwner = useIsNestedSafeOwner()

  const onChange = (event: SelectChangeEvent<string>) => {
    trackEvent(MODALS_EVENTS.CHANGE_SIGNER)
    setSignerAddress?.(event.target.value)
  }

  const isOptionEnabled = useCallback(
    (address: string) => {
      if (!safeTx) {
        return true
      }

      if (safeTx.signatures.size < safe.threshold) {
        const signers = Array.from(safeTx.signatures.keys())
        return !signers.some((key) => sameAddress(key, address))
      }

      return true
    },
    [safeTx, safe.threshold],
  )

  const options = useMemo(() => {
    if (!wallet) {
      return []
    }
    const owners = new Set(nestedSafeOwners ?? [])

    if (willExecute || safe.owners.some((owner) => sameAddress(owner.value, wallet.address))) {
      owners.add(wallet.address)
    }

    return Array.from(owners)
  }, [nestedSafeOwners, safe.owners, wallet, willExecute])

  if (!wallet || !isNestedOwner) {
    return null
  }

  return (
    <TxCard>
      <Typography variant="h5" display="flex" gap={1} alignItems="center">
        <SvgIcon component={SignatureIcon} inheritViewBox fontSize="small" />
        {willExecute ? 'Execute' : 'Sign'} with
        <Tooltip
          title={`Your connected wallet controls other Safe Accounts, which can sign this transaction. You can select which Account to ${
            willExecute ? 'execute' : 'sign'
          } with.`}
          arrow
          placement="top"
        >
          <SvgIcon component={InfoIcon} inheritViewBox color="border" fontSize="small" />
        </Tooltip>
      </Typography>

      <Stack alignItems="center" spacing={1}>
        <FormControl fullWidth size="medium">
          <InputLabel id="signer-label">Signer Account</InputLabel>
          <Select
            className={css.signerForm}
            labelId="signer-label"
            label="Signer account"
            fullWidth
            onChange={onChange}
            value={signerAddress ?? options.filter(isOptionEnabled)[0]}
          >
            {options?.map((owner) => (
              <MenuItem key={owner} value={owner} disabled={!isOptionEnabled(owner)}>
                <EthHashInfo address={owner} avatarSize={32} onlyName />
                {!isOptionEnabled(owner) && (
                  <Typography variant="caption" component="span" className={css.disabledPill}>
                    Already signed
                  </Typography>
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </TxCard>
  )
}
