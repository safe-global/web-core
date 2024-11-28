import EthHashInfo from '@/components/common/EthHashInfo'
import Track from '@/components/common/Track'
import { OVERVIEW_EVENTS } from '@/services/analytics'
import { ChevronRight } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useState, type ReactElement } from 'react'

const MAX_SUBACCOUNTS = 5

export function SubaccountsList({ subaccounts }: { subaccounts: Array<string> }): ReactElement {
  const [showAll, setShowAll] = useState(false)
  const subaccountsToShow = showAll ? subaccounts : subaccounts.slice(0, MAX_SUBACCOUNTS)

  const onShowAll = () => {
    setShowAll(true)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
      {subaccountsToShow.map((subaccount) => {
        return (
          <Box
            sx={{
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid var(--color-border-light)',
              borderRadius: ({ shape }) => `${shape.borderRadius}px`,
              cursor: 'pointer',
              py: '11px',
              px: 2,
              '&:hover': {
                backgroundColor: 'var(--color-background-light)',
                borderColor: 'var(--color-secondary-light)',
              },
            }}
            key={subaccount}
          >
            <EthHashInfo address={subaccount} />
            <ChevronRight color="border" />
          </Box>
        )
      })}
      {subaccounts.length > MAX_SUBACCOUNTS && !showAll && (
        <Track {...OVERVIEW_EVENTS.SHOW_ALL_SUBACCOUNTS}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              textTransform: 'uppercase',
            }}
            onClick={onShowAll}
          >
            Show all Subaccounts
            <ChevronRight color="border" sx={{ transform: 'rotate(90deg)', ml: 1 }} fontSize="inherit" />
          </Typography>
        </Track>
      )}
    </Box>
  )
}