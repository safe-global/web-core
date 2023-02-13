import type { SelectChangeEvent } from '@mui/material'
import { MenuItem, Select, Skeleton } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import useChains from '@/hooks/useChains'
import { useRouter } from 'next/router'
import ChainIndicator from '../ChainIndicator'
import css from './styles.module.css'
import { useChainId } from '@/hooks/useChainId'
import chains from '@/config/chains'
import type { ReactElement } from 'react'
import { trackEvent, OVERVIEW_EVENTS } from '@/services/analytics'
import { AppRoutes } from '@/config/routes'
import { formatPrefixedAddress, parsePrefixedAddress } from '@/utils/addresses'

const NetworkChanger = (): ReactElement => {
  const { configs } = useChains()
  const chainId = useChainId()
  const router = useRouter()

  const handleNetworkSwitch = (event: SelectChangeEvent) => {
    const selectedChainId = event.target.value
    const newShortName = Object.entries(chains).find(([, val]) => val === selectedChainId)?.[0]

    if (!newShortName) return

    trackEvent({ ...OVERVIEW_EVENTS.SWITCH_NETWORK, label: selectedChainId })

    const newRoute = {
      pathname: AppRoutes.transactions.create,
      query: {
        chain: newShortName,
      } as {
        chain: string
        safe?: string
      },
    }

    if (router.query?.safe) {
      const { address } = parsePrefixedAddress(router.query?.safe as string)
      newRoute.query.safe = formatPrefixedAddress(address, newShortName)
    }

    return router.push(newRoute)
  }

  return configs.length ? (
    <Select
      value={chainId}
      onChange={handleNetworkSwitch}
      size="small"
      className={css.select}
      variant="standard"
      IconComponent={ExpandMoreIcon}
      MenuProps={{
        sx: {
          '& .MuiPaper-root': {
            mt: 2,
          },
        },
      }}
      sx={{
        '& .MuiSelect-select': {
          py: 0,
        },
        '& svg path': {
          fill: ({ palette }) => palette.border.main,
        },
      }}
    >
      {configs
        .filter((chain) => chain.chainId == '1' || chain.chainId == '137')
        .map((chain) => {
          return (
            <MenuItem key={chain.chainId} value={chain.chainId}>
              <ChainIndicator chainId={chain.chainId} inline />
            </MenuItem>
          )
        })}
    </Select>
  ) : (
    <Skeleton width={94} height={31} sx={{ mx: 2 }} />
  )
}

export default NetworkChanger
