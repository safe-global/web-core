import type { ReactElement, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Button, Box, Paper, Typography } from '@mui/material'
import AccountItem from './AccountItem'
import { type SafeItems } from './useAllSafes'
import Track from '@/components/common/Track'
import { OVERVIEW_EVENTS } from '@/services/analytics'
import css from './styles.module.css'
import useWallet from '@/hooks/wallets/useWallet'
import useConnectWallet from '@/components/common/ConnectWallet/useConnectWallet'

type PaginatedSafeListProps = {
  safes: SafeItems
  title: ReactNode
  action?: ReactElement
  onLinkClick?: () => void
}

const DEFAULT_SHOWN = 5
const MAX_DEFAULT_SHOWN = 7
const PAGE_SIZE = 5

const PaginatedSafeList = ({ safes, title, action, onLinkClick }: PaginatedSafeListProps) => {
  const [maxShownSafes, setMaxShownSafes] = useState<number>(DEFAULT_SHOWN)
  const wallet = useWallet()
  const handleConnect = useConnectWallet()

  const shownSafes = useMemo(() => {
    if (safes.length <= MAX_DEFAULT_SHOWN) {
      return safes
    }
    return safes.slice(0, maxShownSafes)
  }, [safes, maxShownSafes])

  const onShowMoreSafes = () => setMaxShownSafes((prev) => prev + PAGE_SIZE)

  return (
    <Paper className={css.safeList}>
      <div className={css.listHeader}>
        <Typography variant="h5" fontWeight={700} mb={2} className={css.listTitle}>
          {title}
          {safes.length > 0 && (
            <Typography component="span" color="text.secondary" fontSize="inherit" fontWeight="normal">
              {' '}
              ({safes.length})
            </Typography>
          )}
        </Typography>
        {action}
      </div>
      {shownSafes.length ? (
        shownSafes.map((item) => <AccountItem onLinkClick={onLinkClick} {...item} key={item.chainId + item.address} />)
      ) : !wallet ? (
        <Typography variant="body2" color="text.secondary" textAlign="center" my={3} mx="auto" width={250}>
          Connect a wallet to view your Safe Accounts or to create a new one
          <Button onClick={handleConnect} disableElevation size="small" sx={{ marginTop: 2 }}>
            Connect a wallet
          </Button>
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" textAlign="center" my={3} mx="auto" width={250}>
          You don&apos;t have any Safe Accounts yet
        </Typography>
      )}
      {safes.length > shownSafes.length && (
        <Box display="flex" justifyContent="center">
          <Track {...OVERVIEW_EVENTS.SHOW_MORE_SAFES}>
            <Button onClick={onShowMoreSafes}>Show more</Button>
          </Track>
        </Box>
      )}
    </Paper>
  )
}

export default PaginatedSafeList
