import { useSafesGetSafeOverviewV1Query } from '@safe-global/store/gateway/AUTO_GENERATED/safes'
import { SafeOverviewResult } from '@safe-global/store/gateway/types'
import { useEffect, useMemo } from 'react'

import { selectAllChainsIds } from '@/src/store/chains'
import { SafesSliceItem, updateSafeInfo } from '@/src/store/safesSlice'
import { Address } from '@/src/types/address'
import { makeSafeId } from '@/src/utils/formatters'
import { useAppDispatch, useAppSelector } from '@/src/store/hooks'

export const useMyAccountsService = (item: SafesSliceItem) => {
  const dispatch = useAppDispatch()
  const chainIds = useAppSelector(selectAllChainsIds)
  const safes = useMemo(
    () => chainIds.map((chainId: string) => makeSafeId(chainId, item.SafeInfo.address.value)).join(','),
    [chainIds, item.SafeInfo.address.value],
  )
  const { data } = useSafesGetSafeOverviewV1Query<SafeOverviewResult>({
    safes,
    currency: 'usd',
    trusted: true,
    excludeSpam: true,
  })

  useEffect(() => {
    if (!data) {
      return
    }

    const safe = data[0]

    dispatch(
      updateSafeInfo({
        address: safe.address.value as Address,
        item: {
          chains: data.map((safeInfo) => safeInfo.chainId),
          SafeInfo: {
            ...safe,
            fiatTotal: data.reduce((prev, { fiatTotal }) => parseFloat(fiatTotal) + prev, 0).toString(),
          },
        },
      }),
    )
  }, [data, dispatch])
}
