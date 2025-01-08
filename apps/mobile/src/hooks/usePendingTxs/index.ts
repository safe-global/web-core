import { useGetPendingTxsQuery } from '@safe-global/store/gateway'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  ConflictHeaderQueuedItem,
  LabelQueuedItem,
  QueuedItemPage,
  TransactionQueuedItem,
} from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { groupPendingTxs } from '@/src/features/PendingTx/utils'
import { selectActiveSafe } from '@/src/store/activeSafeSlice'
import { safelyDecodeURIComponent } from 'expo-router/build/fork/getStateFromPath-forks'
import { useInfiniteScroll } from '../useInfiniteScroll'

const usePendingTxs = () => {
  const activeSafe = useSelector(selectActiveSafe)
  const [pageUrl, setPageUrl] = useState<string>()

  const { data, isLoading, isFetching, refetch, isUninitialized } = useGetPendingTxsQuery(
    {
      chainId: activeSafe.chainId,
      safeAddress: activeSafe.address,
      cursor: pageUrl && safelyDecodeURIComponent(pageUrl?.split('cursor=')[1]),
    },
    {
      skip: !activeSafe.chainId,
    },
  )
  const { list, onEndReached: fetchMoreTx } = useInfiniteScroll<
    QueuedItemPage,
    ConflictHeaderQueuedItem | LabelQueuedItem | TransactionQueuedItem
  >({
    refetch,
    setPageUrl,
    data,
  })

  const pendingTxs = useMemo(() => groupPendingTxs(list || []), [list])

  return {
    hasMore: Boolean(data?.next),
    amount: pendingTxs.amount,
    data: pendingTxs.sections,
    fetchMoreTx,
    isLoading: isLoading || isUninitialized,
    isFetching: isFetching,
  }
}

export default usePendingTxs
