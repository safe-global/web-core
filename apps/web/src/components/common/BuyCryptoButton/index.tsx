import { SafeAppsTag } from '@/config/constants'
import { AppRoutes } from '@/config/routes'
import { useRemoteSafeApps } from '@/hooks/safe-apps/useRemoteSafeApps'
import RampLogo from '@/public/images/common/ramp_logo.svg'
import { OVERVIEW_EVENTS } from '@/services/analytics'
import madProps from '@/utils/mad-props'
import AddIcon from '@mui/icons-material/Add'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { Alert, Box, Button, ButtonBase, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Link, { type LinkProps } from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo, type ReactNode } from 'react'
import Track from '../Track'
import css from './styles.module.css'

const useOnrampAppUrl = (): string | undefined => {
  const [onrampApps] = useRemoteSafeApps({ tag: SafeAppsTag.ONRAMP })
  return onrampApps?.[0]?.url
}

const useBuyCryptoHref = (): LinkProps['href'] | undefined => {
  const query = useSearchParams()
  const safe = query?.get('safe')
  const appUrl = useOnrampAppUrl()

  return useMemo(() => {
    if (!safe || !appUrl) return undefined
    return { pathname: AppRoutes.apps.open, query: { safe, appUrl } }
  }, [safe, appUrl])
}

const buttonStyles = {
  minHeight: '37.5px',
}

const BuyCryptoOption = ({ name, children }: { name: string; children: ReactNode }) => {
  return (
    <ButtonBase className={css.button}>
      <Typography display="flex" alignItems="center" fontWeight="bold" fontSize="18px" gap={1}>
        {children}
        {name}
      </Typography>
      <ChevronRightRoundedIcon color="border" />
    </ButtonBase>
  )
}

const _BuyCryptoOptions = ({ rampLink }: { rampLink?: LinkProps['href'] }) => {
  if (rampLink) {
    return (
      <Box position="relative">
        <Track {...OVERVIEW_EVENTS.BUY_CRYPTO_BUTTON} label="onboarding">
          <Link href={rampLink} passHref>
            <BuyCryptoOption name="Ramp">
              <RampLogo />
            </BuyCryptoOption>
          </Link>
        </Track>
      </Box>
    )
  }

  return (
    <Alert severity="info">
      Find an on-ramp provider that supports your region and on-ramp funds to your Safe Account address.
    </Alert>
  )
}

const InternalBuyCryptoButton = ({ href, pagePath }: { href?: LinkProps['href']; pagePath: string }) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  if (!href) return null

  return (
    <>
      <Track {...OVERVIEW_EVENTS.BUY_CRYPTO_BUTTON} label={pagePath}>
        <Link href={href} passHref>
          <Button
            variant="contained"
            size={isSmallScreen ? 'medium' : 'small'}
            sx={buttonStyles}
            startIcon={<AddIcon />}
            className={css.buyCryptoButton}
            fullWidth
          >
            Buy crypto
          </Button>
        </Link>
      </Track>
    </>
  )
}

const BuyCryptoButton = madProps(InternalBuyCryptoButton, {
  href: useBuyCryptoHref,
  pagePath: usePathname,
})

export const BuyCryptoOptions = madProps(_BuyCryptoOptions, {
  rampLink: useBuyCryptoHref,
})

export default BuyCryptoButton
