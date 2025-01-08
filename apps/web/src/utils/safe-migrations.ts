import { Safe_to_l2_migration__factory, Safe_migration__factory } from '@/types/contracts'
import { getCompatibilityFallbackHandlerDeployments } from '@safe-global/safe-deployments'
import { type ExtendedSafeInfo } from '@/store/safeInfoSlice'
import { getSafeContractDeployment, hasMatchingDeployment } from '@/services/contracts/deployments'
import { sameAddress } from './addresses'
import { getSafeToL2MigrationDeployment, getSafeMigrationDeployment } from '@safe-global/safe-deployments'
import {
  type MetaTransactionData,
  OperationType,
  type SafeTransaction,
  type SafeVersion,
} from '@safe-global/safe-core-sdk-types'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { isValidMasterCopy } from '@/services/contracts/safeContracts'
import { isMultiSendCalldata } from './transaction-calldata'
import { decodeMultiSendData } from '@safe-global/protocol-kit/dist/src/utils'
import { __unsafe_createMultiSendTx } from '@/services/tx/tx-sender'
import { LATEST_SAFE_VERSION } from '@/config/constants'

/**
 *
 * If the Safe is using a invalid masterCopy this function will modify the passed in `safeTx` by making it a MultiSend that migrates the Safe to L2 as the first action.
 *
 * This only happens under the conditions that
 * - The Safe's nonce is 0
 * - The SafeTx's nonce is 0
 * - The Safe is using an invalid masterCopy
 * - The SafeTx is not already including a Migration
 *
 * @param safeTx original SafeTx
 * @param safe
 * @param chain
 * @returns
 */
export const prependSafeToL2Migration = (
  safeTx: SafeTransaction | undefined,
  safe: ExtendedSafeInfo,
  chain: ChainInfo | undefined,
): Promise<SafeTransaction | undefined> => {
  if (!chain) {
    throw new Error('No Network information available')
  }

  const safeL2Deployment = getSafeContractDeployment(chain, safe.version)
  const safeL2DeploymentAddress = safeL2Deployment?.networkAddresses[chain.chainId]
  const safeToL2MigrationDeployment = getSafeToL2MigrationDeployment({ network: chain.chainId })
  const safeToL2MigrationAddress = safeToL2MigrationDeployment?.networkAddresses[chain.chainId]

  if (
    !safeTx ||
    safeTx.signatures.size > 0 ||
    !chain.l2 ||
    safeTx.data.nonce > 0 ||
    isValidMasterCopy(safe.implementationVersionState) ||
    !safeToL2MigrationAddress ||
    !safeL2DeploymentAddress
  ) {
    // We do not migrate on L1s
    // We cannot migrate if the nonce is > 0
    // We do not modify already signed txs
    // We do not modify supported masterCopies
    // We cannot migrate if no migration contract or L2 contract exists
    return Promise.resolve(safeTx)
  }

  const safeToL2MigrationInterface = Safe_to_l2_migration__factory.createInterface()

  if (sameAddress(safe.implementation.value, safeL2DeploymentAddress)) {
    // Safe already has the correct L2 masterCopy
    // This should in theory never happen if the implementationState is valid
    return Promise.resolve(safeTx)
  }

  // If the Safe is a L1 masterCopy on a L2 network and still has nonce 0, we prepend a call to the migration contract to the safeTx.
  const txData = safeTx.data.data

  let internalTxs: MetaTransactionData[]
  if (isMultiSendCalldata(txData)) {
    // Check if the first tx is already a call to the migration contract
    internalTxs = decodeMultiSendData(txData)
  } else {
    internalTxs = [{ to: safeTx.data.to, operation: safeTx.data.operation, value: safeTx.data.value, data: txData }]
  }

  if (sameAddress(internalTxs[0]?.to, safeToL2MigrationAddress)) {
    // We already migrate. Nothing to do.
    return Promise.resolve(safeTx)
  }

  // Prepend the migration tx
  const newTxs: MetaTransactionData[] = [
    {
      operation: OperationType.DelegateCall, // DELEGATE CALL REQUIRED
      data: safeToL2MigrationInterface.encodeFunctionData('migrateToL2', [safeL2DeploymentAddress]),
      to: safeToL2MigrationAddress,
      value: '0',
    },
    ...internalTxs,
  ]

  return __unsafe_createMultiSendTx(newTxs)
}

export const createUpdateMigration = (
  chain: ChainInfo,
  safeVersion: string,
  fallbackHandler?: string,
): MetaTransactionData => {
  const deployment = getSafeMigrationDeployment({
    version: chain.recommendedMasterCopyVersion || LATEST_SAFE_VERSION,
    released: true,
    network: chain.chainId,
  })

  if (!deployment) {
    throw new Error('Migration deployment not found')
  }

  // Keep fallback handler if it's not a default one
  const keepFallbackHandler =
    !!fallbackHandler &&
    !hasMatchingDeployment(getCompatibilityFallbackHandlerDeployments, fallbackHandler, chain.chainId, [
      safeVersion as SafeVersion,
    ])

  const method = (
    keepFallbackHandler
      ? chain.l2
        ? 'migrateL2Singleton'
        : 'migrateSingleton'
      : chain.l2
        ? 'migrateL2WithFallbackHandler'
        : 'migrateWithFallbackHandler'
  ) as 'migrateSingleton' // apease typescript

  const interfce = Safe_migration__factory.createInterface()

  const tx: MetaTransactionData = {
    operation: OperationType.DelegateCall, // delegate call required
    data: interfce.encodeFunctionData(method),
    to: deployment.defaultAddress,
    value: '0',
  }

  return tx
}
