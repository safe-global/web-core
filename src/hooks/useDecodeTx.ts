import { type SafeTransaction } from '@safe-global/safe-core-sdk-types'
import {
  getConfirmationView,
  type BaselineConfirmationView,
  type CowSwapConfirmationView,
  type DecodedDataResponse,
} from '@safe-global/safe-gateway-typescript-sdk'
import { getNativeTransferData } from '@/services/tx/tokenTransferParams'
import { isEmptyHexData } from '@/utils/hex'
import type { AsyncResult } from './useAsync'
import useAsync from './useAsync'
import useChainId from './useChainId'
import useSafeAddress from '@/hooks/useSafeAddress'

const useDecodeTx = (
  tx?: SafeTransaction,
): AsyncResult<DecodedDataResponse | BaselineConfirmationView | CowSwapConfirmationView> => {
  const chainId = useChainId()
  const safeAddress = useSafeAddress()
  const encodedData = tx?.data.data
  const isEmptyData = !!encodedData && isEmptyHexData(encodedData)
  const isRejection = isEmptyData && tx?.data.value === '0'
  const nativeTransfer = isEmptyData && !isRejection ? getNativeTransferData(tx?.data) : undefined

  const [data, error, loading] = useAsync<
    DecodedDataResponse | BaselineConfirmationView | CowSwapConfirmationView | undefined
  >(() => {
    if (!encodedData || isEmptyData) return Promise.resolve(nativeTransfer)
    return getConfirmationView(chainId, safeAddress, encodedData, tx.data.to)
  }, [chainId, encodedData, isEmptyData, tx?.data.to, nativeTransfer, safeAddress])

  return [data, error, loading]
}

export default useDecodeTx
