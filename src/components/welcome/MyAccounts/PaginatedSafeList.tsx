import { type ReactElement, type ReactNode, useState, useCallback, useEffect, useMemo } from 'react'
import { Paper, Typography } from '@mui/material'
import AccountItem from './AccountItem'
import { type SafeItem } from './useAllSafes'
import css from './styles.module.css'
import useSafeOverviews from './useSafeOverviews'
import { sameAddress } from '@/utils/addresses'
import InfiniteScroll from '@/components/common/InfiniteScroll'
import { type MultiChainSafeItem } from './useAllSafesGrouped'
import MultiAccountItem from './MultiAccountItem'
import { isMultiChainSafeItem } from './utils/multiChainSafe'

type PaginatedSafeListProps = {
  safes?: (SafeItem | MultiChainSafeItem)[]
  title: ReactNode
  noSafesMessage?: ReactNode
  action?: ReactElement
  onLinkClick?: () => void
}

type SafeListPageProps = {
  safes: (SafeItem | MultiChainSafeItem)[]
  onLinkClick: PaginatedSafeListProps['onLinkClick']
}

const DEFAULT_PAGE_SIZE = 10

export const SafeListPage = ({ safes, onLinkClick }: SafeListPageProps) => {
  const flattenedSafes = useMemo(
    () => safes.flatMap((safe) => (isMultiChainSafeItem(safe) ? safe.safes : safe)),
    [safes],
  )
  const [overviews] = useSafeOverviews(flattenedSafes)

  const findOverview = (item: SafeItem) => {
    return overviews?.find(
      (overview) => item.chainId === overview.chainId && sameAddress(overview.address.value, item.address),
    )
  }

  return (
    <>
      {safes.map((item) =>
        isMultiChainSafeItem(item) ? (
          <MultiAccountItem
            onLinkClick={onLinkClick}
            key={item.address}
            multiSafeAccountItem={item}
            safeOverviews={overviews?.filter((overview) => sameAddress(overview.address.value, item.address))}
          />
        ) : (
          <AccountItem
            onLinkClick={onLinkClick}
            safeItem={item}
            safeOverview={findOverview(item)}
            key={item.chainId + item.address}
          />
        ),
      )}
    </>
  )
}

const AllSafeListPages = ({
  safes,
  onLinkClick,
  pageSize = DEFAULT_PAGE_SIZE,
}: SafeListPageProps & { pageSize?: number }) => {
  const totalPages = Math.ceil(safes.length / pageSize)
  const [pages, setPages] = useState<(SafeItem | MultiChainSafeItem)[][]>([])

  const onNextPage = useCallback(() => {
    setPages((prev) => {
      const pageIndex = prev.length
      const nextPage = safes.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
      return prev.concat([nextPage])
    })
  }, [safes, pageSize])

  useEffect(() => {
    if (safes.length > 0) {
      setPages([safes.slice(0, pageSize)])
    }
  }, [safes, pageSize])

  return (
    <>
      {pages.map((pageSafes, index) => (
        <SafeListPage key={index} safes={pageSafes} onLinkClick={onLinkClick} />
      ))}

      {totalPages > pages.length && <InfiniteScroll onLoadMore={onNextPage} key={pages.length} />}
    </>
  )
}

const PaginatedSafeList = ({ safes, title, action, noSafesMessage, onLinkClick }: PaginatedSafeListProps) => {
  const multiChainSafes = useMemo(() => safes?.filter(isMultiChainSafeItem), [safes])
  const singleChainSafes = useMemo(() => safes?.filter((safe) => !isMultiChainSafeItem(safe)), [safes])

  const totalMultiChainSafes = multiChainSafes?.length ?? 0
  const totalSingleChainSafes = singleChainSafes?.length ?? 0
  const totalSafes = totalMultiChainSafes + totalSingleChainSafes

  return (
    <Paper className={css.safeList}>
      <div className={css.listHeader}>
        <Typography variant="h5" fontWeight={700} mb={2} className={css.listTitle}>
          {title}

          {safes && safes.length > 0 && (
            <Typography component="span" color="var(--color-primary-light)" fontSize="inherit" fontWeight="normal">
              {' '}
              ({safes.length})
            </Typography>
          )}
        </Typography>

        {action}
      </div>

      {totalSafes > 0 ? (
        <>
          {multiChainSafes && multiChainSafes.length > 0 && (
            <AllSafeListPages safes={multiChainSafes} onLinkClick={onLinkClick} pageSize={1} />
          )}
          {singleChainSafes && singleChainSafes.length > 0 && (
            <AllSafeListPages safes={singleChainSafes} onLinkClick={onLinkClick} pageSize={10} />
          )}
        </>
      ) : (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={3} mx="auto" width={250}>
          {safes ? noSafesMessage : 'Loading...'}
        </Typography>
      )}
    </Paper>
  )
}

export default PaginatedSafeList
