import { type SyntheticEvent, useState, useContext, useCallback } from 'react'
import { CircularProgress, CardActions, Button, Typography, Stack, Divider } from '@mui/material'
import EthHashInfo from '@/components/common/EthHashInfo'
import CheckWallet from '@/components/common/CheckWallet'
import { Errors, trackError } from '@/services/exceptions'
import { dispatchRecoveryExecution } from '@/features/recovery/services/recovery-sender'
import useWallet from '@/hooks/wallets/useWallet'
import useSafeInfo from '@/hooks/useSafeInfo'
import ErrorMessage from '@/components/tx/ErrorMessage'
import TxCard from '@/components/tx-flow/common/TxCard'
import FieldsGrid from '@/components/tx/FieldsGrid'
import { TxModalContext } from '@/components/tx-flow'
import NetworkWarning from '@/components/new-safe/create/NetworkWarning'
import { RecoveryValidationErrors } from '@/features/recovery/components/RecoveryValidationErrors'
import type { RecoveryQueueItem } from '@/features/recovery/services/recovery-state'

type RecoveryAttemptReviewProps = {
  item: RecoveryQueueItem
}

const RecoveryAttemptReview = ({ item }: RecoveryAttemptReviewProps) => {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error>()
  const wallet = useWallet()
  const { safe } = useSafeInfo()
  const { setTxFlow } = useContext(TxModalContext)

  const onFormSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault()

      if (!wallet) return

      setError(undefined)
      setIsPending(true)

      try {
        await dispatchRecoveryExecution({
          provider: wallet.provider,
          chainId: safe.chainId,
          args: item.args,
          delayModifierAddress: item.address,
          signerAddress: wallet.address,
        })
        setTxFlow(undefined)
      } catch (err) {
        trackError(Errors._812, err)
        setError(err as Error)
      }

      setIsPending(false)
    },
    [wallet, safe, item.address, item.args, setTxFlow],
  )

  return (
    <TxCard>
      <form onSubmit={onFormSubmit}>
        <Stack gap={3} mb={2}>
          {item.address && (
            <FieldsGrid title="Initiated by">
              <EthHashInfo address={item.address} showAvatar hasExplorer showName />
            </FieldsGrid>
          )}
          <Typography>Confirm or reject within the review time window.</Typography>

          <NetworkWarning />

          <RecoveryValidationErrors item={item} />

          {error && <ErrorMessage error={error}>Error submitting the transaction.</ErrorMessage>}
        </Stack>

        <Divider sx={{ mx: -3, my: 3.5 }} />

        <CardActions>
          {/* Submit button, also available to non-owner role members */}
          <CheckWallet allowNonOwner>
            {(isOk) => (
              <Button
                data-testid="execute-through-role-form-btn"
                variant="contained"
                type="submit"
                disabled={!isOk || isPending}
                sx={{ minWidth: '112px' }}
              >
                {isPending ? <CircularProgress size={20} /> : 'Execute'}
              </Button>
            )}
          </CheckWallet>
        </CardActions>
      </form>
    </TxCard>
  )
}

export default RecoveryAttemptReview
