import useSafeInfo from '@/hooks/useSafeInfo'
import { useGetSafenetConfigQuery } from '@/store/safenet'
import { sameAddress } from '@/utils/addresses'

const useIsSafenetEnabled = () => {
  const { safe } = useSafeInfo()
  const { data: safenetConfig } = useGetSafenetConfigQuery()

  return sameAddress(safe.guard?.value, safenetConfig?.guards[safe.chainId])
}

export default useIsSafenetEnabled
