import type { SafeContractImplementationType } from '@safe-global/protocol-kit/dist/src/types/contracts'
import type { MetaTransactionData } from '@safe-global/safe-core-sdk-types'
import { OperationType } from '@safe-global/safe-core-sdk-types'
import type { ChainInfo, SafeInfo } from '@safe-global/safe-gateway-typescript-sdk'
import semverSatisfies from 'semver/functions/satisfies'
import { getReadOnlyFallbackHandlerContract, getReadOnlyGnosisSafeContract } from '@/services/contracts/safeContracts'
import { assertValidSafeVersion } from '@/hooks/coreSDK/safeCoreSDK'
import { SAFE_FEATURES } from '@safe-global/protocol-kit/dist/src/utils/safeVersions'
import { hasSafeFeature } from '@/utils/safe-versions'
import { getLatestSafeVersion } from '@/utils/chains'
import { createUpdateMigration } from '@/utils/safe-migrations'

const getChangeFallbackHandlerCallData = async (
  safeContractInstance: SafeContractImplementationType,
  chain: ChainInfo,
): Promise<string> => {
  if (!hasSafeFeature(SAFE_FEATURES.SAFE_FALLBACK_HANDLER, getLatestSafeVersion(chain))) {
    return '0x'
  }

  const fallbackHandlerAddress = await (
    await getReadOnlyFallbackHandlerContract(getLatestSafeVersion(chain))
  ).getAddress()
  // @ts-ignore
  return safeContractInstance.encode('setFallbackHandler', [fallbackHandlerAddress])
}

/**
 * For 1.3.0 Safes, does a delegate call to a migration contract.
 *
 * For older Safes, creates two transactions:
 * - change the mastercopy address
 * - set the fallback handler address
 */
export const createUpdateSafeTxs = async (safe: SafeInfo, chain: ChainInfo): Promise<MetaTransactionData[]> => {
  assertValidSafeVersion(safe.version)

  // 1.3.0 Safes are updated using a delegate call to a migration contract
  if (semverSatisfies(safe.version, '1.3.0')) {
    return [createUpdateMigration(chain, safe.version, safe.fallbackHandler?.value)]
  }

  // For older Safes, we need to create two transactions
  const latestMasterCopyAddress = await (
    await getReadOnlyGnosisSafeContract(chain, getLatestSafeVersion(chain))
  ).getAddress()
  const currentReadOnlySafeContract = await getReadOnlyGnosisSafeContract(chain, safe.version)

  const updatedReadOnlySafeContract = await getReadOnlyGnosisSafeContract(chain, getLatestSafeVersion(chain, true))

  // @ts-expect-error this was removed in 1.3.0 but we need to support it for older safe versions
  const changeMasterCopyCallData = currentReadOnlySafeContract.encode('changeMasterCopy', [latestMasterCopyAddress])
  const changeFallbackHandlerCallData = await getChangeFallbackHandlerCallData(updatedReadOnlySafeContract, chain)

  const txs: MetaTransactionData[] = [
    {
      to: safe.address.value,
      value: '0',
      data: changeMasterCopyCallData,
      operation: OperationType.Call,
    },
    {
      to: safe.address.value,
      value: '0',
      data: changeFallbackHandlerCallData,
      operation: OperationType.Call,
    },
  ]

  return txs
}
