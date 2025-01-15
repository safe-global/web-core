import { type SafeTransaction } from '@safe-global/safe-core-sdk-types'
import { getConfirmationView, type AnyConfirmationView, Operation } from '@safe-global/safe-gateway-typescript-sdk'
import { getNativeTransferData } from '@/services/tx/tokenTransferParams'
import { isEmptyHexData } from '@/utils/hex'
import type { AsyncResult } from './useAsync'
import useAsync from './useAsync'
import useChainId from './useChainId'
import useSafeAddress from '@/hooks/useSafeAddress'

const useDecodeTx = (tx?: SafeTransaction): AsyncResult<AnyConfirmationView> => {
  const chainId = useChainId()
  const safeAddress = useSafeAddress()
  const { to, value, data, operation = Operation.CALL } = tx?.data || {}

  return useAsync<AnyConfirmationView | undefined>(
    () => {
      if (to === undefined || value === undefined) return

      const isEmptyData = !!data && isEmptyHexData(data)
      if (!data || isEmptyData) {
        const isRejection = isEmptyData && value === '0'
        const nativeTransfer = isEmptyData && !isRejection ? getNativeTransferData({ to, value }) : undefined
        return Promise.resolve(nativeTransfer)
      }

      return getConfirmationView(chainId, safeAddress, operation, data, to, value)
    },
    [chainId, safeAddress, to, value, data],
    false,
  )
}

export default useDecodeTx
