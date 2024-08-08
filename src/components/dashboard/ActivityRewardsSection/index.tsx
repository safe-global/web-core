import type { ReactNode } from 'react'
import { Typography, Card, SvgIcon, Grid, Button, Box } from '@mui/material'
import css from './styles.module.css'
import { useRemoteSafeApps } from '@/hooks/safe-apps/useRemoteSafeApps'
import { SafeAppsTag } from '@/config/constants'
import SafePass from '@/public/images/common/safe-pass-logo.svg'
import Asterix from '@/public/images/common/asterix.svg'

import classNames from 'classnames'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useRouter } from 'next/router'
import { getSafeAppUrl } from '@/components/safe-apps/SafeAppCard'
import NextLink from 'next/link'
import { OVERVIEW_EVENTS, trackEvent } from '@/services/analytics'
import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@/utils/chains'
import useLocalStorage from '@/services/local-storage/useLocalStorage'
import ExternalLink from '@/components/common/ExternalLink'

const Step = ({ active, title }: { active: boolean; title: ReactNode }) => {
  return (
    <Typography
      className={classNames(css.step, { [css.activeStep]: active })}
      variant="body1"
      fontWeight="bold"
      display="flex"
      gap={1}
    >
      {title}
      {!active && (
        <Typography variant="caption" component="span" className={css.comingSoon}>
          Coming soon
        </Typography>
      )}
    </Typography>
  )
}

const LOCAL_STORAGE_KEY_HIDE_WIDGET = 'hideActivityRewardsBanner'

const ActivityRewardsSection = () => {
  const [matchingApps] = useRemoteSafeApps(SafeAppsTag.SAFE_GOVERNANCE_APP)
  const isDarkMode = useDarkMode()
  const router = useRouter()

  const [widgetHidden = false, setWidgetHidden] = useLocalStorage<boolean>(LOCAL_STORAGE_KEY_HIDE_WIDGET)

  const isSAPBannerEnabled = useHasFeature(FEATURES.SAP_BANNER)
  const governanceApp = matchingApps?.[0]

  if (!governanceApp || !governanceApp?.url || !isSAPBannerEnabled || widgetHidden) return null

  const appUrl = getSafeAppUrl(router, governanceApp?.url)

  const onClick = () => {
    trackEvent(OVERVIEW_EVENTS.OPEN_ACTIVITY_APP)
  }

  const onHide = () => {
    setWidgetHidden(true)
    trackEvent(OVERVIEW_EVENTS.HIDE_ACTIVITY_APP_WIDGET)
  }

  const onLearnMore = () => {
    trackEvent(OVERVIEW_EVENTS.OPEN_LEARN_MORE_ACTIVITY_APP)
  }

  return (
    <>
      <Card className={css.widgetWrapper}>
        <SvgIcon
          component={Asterix}
          inheritViewBox
          sx={{
            color: 'transparent',
            position: 'absolute',
            top: 0,
            right: 0,
            height: '208px',
            width: 'inherit',
            display: { xs: 'none', sm: 'block' },
          }}
        />
        <Grid container item xs={12} sx={{ gap: { xs: 4, lg: 0 } }}>
          <Grid item xs={12} lg={6} p={0}>
            <SvgIcon
              component={SafePass}
              inheritViewBox
              color="border"
              className={classNames(css.milesIcon, { [css.milesIconLight]: !isDarkMode })}
            />
            <Typography
              variant="h1"
              fontWeight={700}
              mt={4}
              className={classNames(css.header, { [css.gradientText]: isDarkMode })}
            >
              Interact with Safe and get rewards
            </Typography>
          </Grid>
          <Grid item xs={12} lg={6} p={0} zIndex={2}>
            <Typography variant="overline" color="primary.light">
              How it works
            </Typography>
            <div className={css.steps}>
              <Step title="Lock SAFE to boost your points!" active />
              <Step title="Get activity points" active />
              <Step title="Receive rewards" active={false} />
            </div>
            <ExternalLink href="https://safe.global/pass">Learn more</ExternalLink>
          </Grid>
          <Grid item xs={12}>
            <Box className={css.links} gap={2}>
              <NextLink href={appUrl} passHref rel="noreferrer" onClick={onClick}>
                <Button fullWidth variant="contained">
                  {'Open Safe{Pass}'}
                </Button>
              </NextLink>

              <Button variant="text" onClick={onHide}>
                Don&apos;t show again
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </>
  )
}

export default ActivityRewardsSection
