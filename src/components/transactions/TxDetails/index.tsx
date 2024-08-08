import { POLLING_INTERVAL } from '@/config/constants'
import useIsExpiredSwap from '@/features/swap/hooks/useIsExpiredSwap'
import useIntervalCounter from '@/hooks/useIntervalCounter'
import React, { type ReactElement } from 'react'
import type { TransactionDetails, TransactionSummary } from '@safe-global/safe-gateway-typescript-sdk'
import { getTransactionDetails } from '@safe-global/safe-gateway-typescript-sdk'
import { Box, CircularProgress, Typography } from '@mui/material'

import TxSigners from '@/components/transactions/TxSigners'
import Summary from '@/components/transactions/TxDetails/Summary'
import TxData from '@/components/transactions/TxDetails/TxData'
import useChainId from '@/hooks/useChainId'
import useAsync from '@/hooks/useAsync'
import {
  isAwaitingExecution,
  isOrderTxInfo,
  isModuleExecutionInfo,
  isMultiSendTxInfo,
  isMultisigDetailedExecutionInfo,
  isMultisigExecutionInfo,
  isOpenSwapOrder,
  isTxQueued,
} from '@/utils/transaction-guards'
import { InfoDetails } from '@/components/transactions/InfoDetails'
import NamedAddressInfo from '@/components/common/NamedAddressInfo'
import css from './styles.module.css'
import ErrorMessage from '@/components/tx/ErrorMessage'
import TxShareLink from '../TxShareLink'
import { ErrorBoundary } from '@sentry/react'
import ExecuteTxButton from '@/components/transactions/ExecuteTxButton'
import SignTxButton from '@/components/transactions/SignTxButton'
import RejectTxButton from '@/components/transactions/RejectTxButton'
import { UnsignedWarning } from '@/components/transactions/Warning'
import Multisend from '@/components/transactions/TxDetails/TxData/DecodedData/Multisend'
import useSafeInfo from '@/hooks/useSafeInfo'
import useIsPending from '@/hooks/useIsPending'
import { isImitation, isTrustedTx } from '@/utils/transactions'
import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@/utils/chains'
import { SwapOrder } from '@/features/swap/components/SwapOrder'

export const NOT_AVAILABLE = 'n/a'

type TxDetailsProps = {
  txSummary: TransactionSummary
  txDetails: TransactionDetails
}

const TxDetailsBlock = ({ txSummary, txDetails }: TxDetailsProps): ReactElement => {
  const isPending = useIsPending(txSummary.id)
  const hasDefaultTokenlist = useHasFeature(FEATURES.DEFAULT_TOKENLIST)
  const isQueue = isTxQueued(txSummary.txStatus)
  const awaitingExecution = isAwaitingExecution(txSummary.txStatus)
  const isUnsigned =
    isMultisigExecutionInfo(txSummary.executionInfo) && txSummary.executionInfo.confirmationsSubmitted === 0

  const isUntrusted =
    isMultisigDetailedExecutionInfo(txDetails.detailedExecutionInfo) &&
    txDetails.detailedExecutionInfo.trusted === false

  // If we have no token list we always trust the transfer
  const isTrustedTransfer = !hasDefaultTokenlist || isTrustedTx(txSummary)
  const isImitationTransaction = isImitation(txSummary)

  let proposer, safeTxHash
  if (isMultisigDetailedExecutionInfo(txDetails.detailedExecutionInfo)) {
    proposer = txDetails.detailedExecutionInfo.proposer?.value
    safeTxHash = txDetails.detailedExecutionInfo.safeTxHash
  }

  const expiredSwap = useIsExpiredSwap(txSummary.txInfo)

  // Module address, name and logoUri
  const moduleAddress = isModuleExecutionInfo(txSummary.executionInfo) ? txSummary.executionInfo.address : undefined
  const moduleAddressInfo = moduleAddress ? txDetails.txData?.addressInfoIndex?.[moduleAddress.value] : undefined

  return (
    <>
      {/* /Details */}
      <div className={`${css.details} ${isUnsigned ? css.noSigners : ''}`}>
        {isOrderTxInfo(txDetails.txInfo) && (
          <div className={css.swapOrder}>
            <ErrorBoundary fallback={<div>Error parsing data</div>}>
              <SwapOrder txData={txDetails.txData} txInfo={txDetails.txInfo} />
            </ErrorBoundary>
          </div>
        )}

        <div className={css.shareLink}>
          <TxShareLink id={txSummary.id} />
        </div>

        <div className={css.txData}>
          <ErrorBoundary fallback={<div>Error parsing data</div>}>
            <TxData txDetails={txDetails} trusted={isTrustedTransfer} imitation={isImitationTransaction} />
          </ErrorBoundary>
        </div>

        {/* Module information*/}
        {moduleAddress && (
          <div className={css.txModule}>
            <InfoDetails title="Executed via module:">
              <NamedAddressInfo
                address={moduleAddress.value}
                name={moduleAddressInfo?.name || moduleAddress.name}
                customAvatar={moduleAddressInfo?.logoUri || moduleAddress.logoUri}
                shortAddress={false}
                showCopyButton
                hasExplorer
              />
            </InfoDetails>
          </div>
        )}

        <div className={css.txSummary}>
          {isUntrusted && !isPending && <UnsignedWarning />}
          <Summary txDetails={txDetails} />
        </div>

        {(isMultiSendTxInfo(txDetails.txInfo) || isOrderTxInfo(txDetails.txInfo)) && (
          <div className={css.multiSend}>
            <ErrorBoundary fallback={<div>Error parsing data</div>}>
              <Multisend txData={txDetails.txData} />
            </ErrorBoundary>
          </div>
        )}
      </div>

      {/* Signers */}
      {!isUnsigned && (
        <div className={css.txSigners}>
          <TxSigners txDetails={txDetails} txSummary={txSummary} />

          {isQueue && (
            <Box className={css.buttons}>
              {awaitingExecution ? <ExecuteTxButton txSummary={txSummary} /> : <SignTxButton txSummary={txSummary} />}
              <RejectTxButton txSummary={txSummary} safeTxHash={safeTxHash} proposer={proposer} />
            </Box>
          )}

          {isQueue && expiredSwap && (
            <Typography color="text.secondary" mt={2}>
              This order has expired. Reject this transaction and try again.
            </Typography>
          )}
        </div>
      )}
    </>
  )
}

const TxDetails = ({
  txSummary,
  txDetails,
}: {
  txSummary: TransactionSummary
  txDetails?: TransactionDetails // optional
}): ReactElement => {
  const chainId = useChainId()
  const { safe } = useSafeInfo()

  const [pollCount] = useIntervalCounter(POLLING_INTERVAL)
  const swapPollCount = isOpenSwapOrder(txSummary.txInfo) ? pollCount : 0

  const [txDetailsData, error, loading] = useAsync<TransactionDetails>(
    async () => {
      if (txDetails && swapPollCount <= 0) {
        return txDetails
      }
      return getTransactionDetails(chainId, txSummary.id)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [txDetails, chainId, txSummary.id, safe.txQueuedTag, swapPollCount],
    false,
  )

  return (
    <div className={css.container}>
      {txDetailsData ? (
        <TxDetailsBlock txSummary={txSummary} txDetails={txDetailsData} />
      ) : loading ? (
        <div className={css.loading}>
          <CircularProgress />
        </div>
      ) : (
        error && (
          <div className={css.error}>
            <ErrorMessage error={error}>Couldn&apos;t load the transaction details</ErrorMessage>
          </div>
        )
      )}
    </div>
  )
}

export default TxDetails
