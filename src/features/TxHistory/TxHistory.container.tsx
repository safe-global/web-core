import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { safelyDecodeURIComponent } from 'expo-router/build/fork/getStateFromPath-forks'

import { useGetTxsHistoryQuery } from '@/src/store/gateway'
import type { TransactionItemPage } from '@/src/store/gateway/AUTO_GENERATED/transactions'
import { selectActiveSafe } from '@/src/store/activeSafeSlice'
import { TxHistoryList } from '@/src/features/TxHistory/components/TxHistoryList'

export function TxHistoryContainer() {
  const [pageUrl, setPageUrl] = useState<string>()
  const [list, setList] = useState<TransactionItemPage['results']>([])
  const activeSafe = useSelector(selectActiveSafe)
  const { data, refetch, isFetching, isUninitialized } = useGetTxsHistoryQuery({
    chainId: activeSafe.chainId,
    safeAddress: activeSafe.address,
    cursor: pageUrl && safelyDecodeURIComponent(pageUrl?.split('cursor=')[1]),
  })

  useEffect(() => {
    if (!data?.results) {
      return
    }

    setList((prev) => [...prev, ...data.results])
  }, [data])

  const onEndReached = () => {
    if (!data?.next) {
      return
    }

    setPageUrl(data.next)
    refetch()
  }

  return <TxHistoryList transactions={list} onEndReached={onEndReached} isLoading={isFetching || isUninitialized} />
}