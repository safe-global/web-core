import {
  AddressEx,
  DetailedExecutionInfo,
  MultisigExecutionDetails,
  MultisigExecutionInfo,
  Transaction,
  TransactionListItem,
  TransactionStatus,
  TransactionSummary,
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

export const isSignaturePending = (tx: TransactionSummary, walletAddress: string | undefined): boolean => {
  const executionInfo = isMultisigExecutionInfo(tx.executionInfo) ? tx.executionInfo : undefined
  return !!executionInfo?.missingSigners?.some((address) => address.value === walletAddress)
}

export const isOwner = (safeOwners: AddressEx[] | undefined, walletAddress: string | undefined) => {
  return safeOwners?.some((owner) => owner.value.toLowerCase() === walletAddress?.toLowerCase())
}

export const isMultisigExecutionDetails = (value: DetailedExecutionInfo | null): value is MultisigExecutionDetails => {
  return value?.type === 'MULTISIG'
}

export const isMultisigExecutionInfo = (value: TransactionSummary['executionInfo']): value is MultisigExecutionInfo =>
  value?.type === 'MULTISIG'

export const isTransaction = (value: TransactionListItem): value is Transaction => value.type === 'TRANSACTION'
