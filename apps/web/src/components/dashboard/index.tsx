import AssetsWidget from '@/components/dashboard/Assets'
import FirstSteps from '@/components/dashboard/FirstSteps'
import GovernanceSection from '@/components/dashboard/GovernanceSection/GovernanceSection'
import Overview from '@/components/dashboard/Overview/Overview'
import PendingTxsList from '@/components/dashboard/PendingTxs/PendingTxsList'
import SafeAppsDashboardSection from '@/components/dashboard/SafeAppsDashboardSection/SafeAppsDashboardSection'
import StakingBanner from '@/components/dashboard/StakingBanner'
import { InconsistentSignerSetupWarning } from '@/features/multichain/components/SignerSetupWarning/InconsistentSignerSetupWarning'
import { useIsRecoverySupported } from '@/features/recovery/hooks/useIsRecoverySupported'
import { SafenetHeader } from '@/features/safenet/SafenetHeader'
import useIsStakingBannerEnabled from '@/features/stake/hooks/useIsStakingBannerEnabled'
import { useHasFeature } from '@/hooks/useChains'
import useIsSafenetEnabled from '@/hooks/useIsSafenetEnabled'
import useSafeInfo from '@/hooks/useSafeInfo'
import { FEATURES } from '@/utils/chains'
import { Grid } from '@mui/material'
import dynamic from 'next/dynamic'
import { type ReactElement } from 'react'
import css from './styles.module.css'

const RecoveryHeader = dynamic(() => import('@/features/recovery/components/RecoveryHeader'))

const Dashboard = (): ReactElement => {
  const { safe } = useSafeInfo()
  const showSafeApps = useHasFeature(FEATURES.SAFE_APPS)
  const isStakingBannerEnabled = useIsStakingBannerEnabled()
  const supportsRecovery = useIsRecoverySupported()
  const isSafenetEnabled = useIsSafenetEnabled()

  return (
    <>
      <Grid container spacing={3}>
        {supportsRecovery && <RecoveryHeader />}

        <Grid item xs={12}>
          <InconsistentSignerSetupWarning />
        </Grid>

        {!isSafenetEnabled && (
          <Grid item xs={12}>
            <SafenetHeader />
          </Grid>
        )}

        <Grid item xs={12}>
          <Overview />
        </Grid>

        <Grid item xs={12} className={css.hideIfEmpty}>
          <FirstSteps />
        </Grid>

        {safe.deployed && (
          <>
            {isStakingBannerEnabled && (
              <Grid item xs={12} className={css.hideIfEmpty}>
                <StakingBanner hideLocalStorageKey="hideStakingBannerDashboard" large />
              </Grid>
            )}

            <Grid item xs={12} />

            <Grid item xs={12} lg={6}>
              <AssetsWidget />
            </Grid>

            <Grid item xs={12} lg={6}>
              <PendingTxsList />
            </Grid>

            {showSafeApps && (
              <Grid item xs={12}>
                <SafeAppsDashboardSection />
              </Grid>
            )}

            <Grid item xs={12} className={css.hideIfEmpty}>
              <GovernanceSection />
            </Grid>
          </>
        )}
      </Grid>
    </>
  )
}

export default Dashboard
