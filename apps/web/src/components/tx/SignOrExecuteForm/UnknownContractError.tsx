import { useMemo, type ReactElement } from 'react'
import type { TransactionData } from '@safe-global/safe-gateway-typescript-sdk'
import ExternalLink from '@/components/common/ExternalLink'
import { useCurrentChain } from '@/hooks/useChains'
import useSafeInfo from '@/hooks/useSafeInfo'
import { getExplorerLink } from '@/utils/gateway'
import ErrorMessage from '../ErrorMessage'
import { isValidMasterCopy } from '@/services/contracts/safeContracts'
import { extractMigrationL2MasterCopyAddress } from '@/features/multichain/utils/extract-migration-data'

const UnknownContractError = ({ txData }: { txData: TransactionData | undefined }): ReactElement | null => {
  const { safe, safeAddress } = useSafeInfo()
  const currentChain = useCurrentChain()
  const newMasterCopy = useMemo(() => {
    return txData && extractMigrationL2MasterCopyAddress(txData)
  }, [txData])

  // Unsupported base contract
  const isUnknown = !isValidMasterCopy(safe.implementationVersionState)

  if (!isUnknown || !!newMasterCopy) return null

  return (
    <ErrorMessage>
      This Safe Account was created with an unsupported base contract. It should <b>ONLY</b> be used for fund recovery.
      Transactions will execute but the transaction list may not immediately update. Transaction success can be verified
      on the{' '}
      <ExternalLink href={currentChain ? getExplorerLink(safeAddress, currentChain.blockExplorerUriTemplate).href : ''}>
        {currentChain?.chainName} explorer
      </ExternalLink>
      .
    </ErrorMessage>
  )
}

export default UnknownContractError
