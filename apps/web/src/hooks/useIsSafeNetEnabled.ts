import useSafeInfo from '@/hooks/useSafeInfo'
import { useGetSafeNetConfigQuery } from '@/store/safenet'
import { sameAddress } from '@/utils/addresses'

const useIsSafeNetEnabled = () => {
  const { safe } = useSafeInfo()
  const { data: safeNetConfig } = useGetSafeNetConfigQuery()

  return sameAddress(safe.guard?.value, safeNetConfig?.guards[safe.chainId])
}

export default useIsSafeNetEnabled
