import {
  AddressEx,
  ConflictHeader,
  Creation,
  Custom,
  DateLabel,
  DetailedExecutionInfo,
  Label,
  MultiSend,
  MultisigExecutionDetails,
  MultisigExecutionInfo,
  SettingsChange,
  Transaction,
  TransactionInfo,
  TransactionListItem,
  TransactionStatus,
  TransactionSummary,
  Transfer,
} from '@gnosis.pm/safe-react-gateway-sdk'

export const isTxQueued = (value: TransactionStatus): boolean => {
  return [
    TransactionStatus.AWAITING_CONFIRMATIONS,
    TransactionStatus.AWAITING_EXECUTION,
    TransactionStatus.WILL_BE_REPLACED,
  ].includes(value)
}

export const isAwaitingExecution = (txStatus: TransactionStatus): boolean =>
  TransactionStatus.AWAITING_EXECUTION === txStatus

export const isOwner = (safeOwners: AddressEx[] | undefined, walletAddress: string | undefined) => {
  return safeOwners?.some((owner) => owner.value.toLowerCase() === walletAddress?.toLowerCase())
}

export const isMultisigExecutionDetails = (value: DetailedExecutionInfo | null): value is MultisigExecutionDetails => {
  return value?.type === 'MULTISIG'
}

export const isMultisigExecutionInfo = (value: TransactionSummary['executionInfo']): value is MultisigExecutionInfo =>
  value?.type === 'MULTISIG'

export const isTransaction = (value: TransactionListItem): value is Transaction => {
  return value.type === 'TRANSACTION'
}

// TransactionInfo type guards
export const isTransferTxInfo = (value: TransactionInfo): value is Transfer => {
  return value.type === 'Transfer'
}

export const isSettingsChangeTxInfo = (value: TransactionInfo): value is SettingsChange => {
  return value.type === 'SettingsChange'
}

export const isCustomTxInfo = (value: TransactionInfo): value is Custom => {
  return value.type === 'Custom'
}

export const isMultisendTxInfo = (value: TransactionInfo): value is MultiSend => {
  return value.type === 'Custom' && value.methodName === 'multiSend'
}

// TODO: worth exporting Cancellation as a TransactionInfo type in the SDK?
export const isCancellationTxInfo = (value: TransactionInfo): boolean => {
  return isCustomTxInfo(value) && value.isCancellation
}

export const isCreationTxInfo = (value: TransactionInfo): value is Creation => {
  return value.type === 'Creation'
}

// TxListItem type guards
export const isTransactionListItem = (value: TransactionListItem): value is Transaction => {
  return value.type === 'TRANSACTION'
}

export const isLabelListItem = (value: TransactionListItem): value is Label => {
  return value.type === 'LABEL'
}
export const isConflictHeaderListItem = (value: TransactionListItem): value is ConflictHeader => {
  return value.type === 'CONFLICT_HEADER'
}

// @ts-expect-error @TODO: Add DateLabel to TransactionListItem type in SDK types
export const isDateLabel = (value: TransactionListItem): value is DateLabel => {
  // @ts-ignore as above
  return value.type === 'DATE_LABEL'
}

export const isSignableBy = (txSummary: TransactionSummary, walletAddress: string): boolean => {
  const executionInfo = isMultisigExecutionInfo(txSummary.executionInfo) ? txSummary.executionInfo : undefined
  return !!executionInfo?.missingSigners?.some((address) => address.value === walletAddress)
}

export const isExecutable = (txSummary: TransactionSummary, walletAddress: string): boolean => {
  if (!txSummary.executionInfo || !isMultisigExecutionInfo(txSummary.executionInfo)) {
    return false
  }
  const { confirmationsRequired, confirmationsSubmitted } = txSummary.executionInfo
  return (
    confirmationsSubmitted >= confirmationsRequired ||
    (confirmationsSubmitted === confirmationsRequired - 1 && isSignableBy(txSummary, walletAddress))
  )
}
