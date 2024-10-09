import type { NextPage } from 'next'
import Head from 'next/head'
import { Button, CircularProgress, Grid, Paper, SvgIcon, Tooltip, Typography } from '@mui/material'
import { QueryStatus } from '@reduxjs/toolkit/query'
import InfoIcon from '@/public/images/notifications/info.svg'

import SettingsHeader from '@/components/settings/SettingsHeader'
import useSafeInfo from '@/hooks/useSafeInfo'
import { sameAddress } from '@/utils/addresses'
import { useContext, useEffect, useMemo } from 'react'
import { TxModalContext } from '@/components/tx-flow'
import { EnableSafenetFlow } from '@/components/tx-flow/flows/EnableSafenet'
import type { SafeNetConfigEntity } from '@/store/safenet'
import {
  useLazyGetSafeNetOffchainStatusQuery,
  useRegisterSafeNetMutation,
  useGetSafeNetConfigQuery,
} from '@/store/safenet'
import type { ExtendedSafeInfo } from '@/store/safeInfoSlice'
import { SAFE_FEATURES } from '@safe-global/protocol-kit/dist/src/utils'
import { hasSafeFeature } from '@/utils/safe-versions'
import { SafenetChainType, isSupportedChain } from '@/utils/safenet'

const getSafeNetTokensByChain = (chainId: number, safeNetConfig: SafeNetConfigEntity): string[] => {
  const tokenSymbols = Object.keys(safeNetConfig.tokens)

  const tokens: string[] = []
  for (const symbol of tokenSymbols) {
    const tokenAddress = safeNetConfig.tokens[symbol][chainId]
    if (tokenAddress) {
      tokens.push(tokenAddress)
    }
  }

  return tokens
}

const SafeNetContent = ({ safeNetConfig, safe }: { safeNetConfig: SafeNetConfigEntity; safe: ExtendedSafeInfo }) => {
  const isVersionWithGuards = hasSafeFeature(SAFE_FEATURES.SAFE_TX_GUARDS, safe.version)
  const safeNetGuardAddress = safeNetConfig.guards[safe.chainId]
  const isSafeNetGuardEnabled = isVersionWithGuards && sameAddress(safe.guard?.value, safeNetGuardAddress)
  const chainSupported = isSupportedChain(Number(safe.chainId), safeNetConfig, SafenetChainType.SOURCE)
  const { setTxFlow } = useContext(TxModalContext)

  // Lazy query because running it on unsupported chain throws an error
  const [
    triggerGetSafeNetOffchainStatus,
    {
      data: safeNetOffchainStatus,
      error: safeNetOffchainStatusError,
      isLoading: safeNetOffchainStatusLoading,
      status: safeNetOffchainStatusStatus,
    },
  ] = useLazyGetSafeNetOffchainStatusQuery()

  // @ts-expect-error bad types. We don't want 404 to be an error - it just means that the safe is not registered
  const offchainLookupError = safeNetOffchainStatusError?.status === 404 ? null : safeNetOffchainStatusError
  const registeredOffchainStatus =
    !offchainLookupError && sameAddress(safeNetOffchainStatus?.guard, safeNetGuardAddress)

  const safeNetStatusQueryWorked =
    safeNetOffchainStatusStatus === QueryStatus.fulfilled || safeNetOffchainStatusStatus === QueryStatus.rejected
  const needsRegistration = safeNetStatusQueryWorked && isSafeNetGuardEnabled && !registeredOffchainStatus
  const [registerSafeNet, { error: registerSafeNetError }] = useRegisterSafeNetMutation()
  const error = offchainLookupError || registerSafeNetError
  const safeNetAssets = useMemo(
    () => getSafeNetTokensByChain(Number(safe.chainId), safeNetConfig),
    [safe.chainId, safeNetConfig],
  )

  if (error) {
    throw error
  }

  useEffect(() => {
    if (needsRegistration) {
      registerSafeNet({ chainId: safe.chainId, safeAddress: safe.address.value })
    }
  }, [needsRegistration, registerSafeNet, safe.chainId, safe.address.value])

  useEffect(() => {
    if (chainSupported) {
      triggerGetSafeNetOffchainStatus({ chainId: safe.chainId, safeAddress: safe.address.value })
    }
  }, [chainSupported, triggerGetSafeNetOffchainStatus, safe.chainId, safe.address.value])

  switch (true) {
    case !chainSupported:
      return (
        <Typography>
          SafeNet is not supported on this chain. List of supported chains ids:{' '}
          {safeNetConfig.chains.sources.join(', ')}
        </Typography>
      )
    case !isVersionWithGuards:
      return <Typography>Please upgrade your Safe to the latest version to use SafeNet</Typography>
    case isSafeNetGuardEnabled:
      return <Typography>SafeNet is enabled. Enjoy your unified experience.</Typography>
    case !isSafeNetGuardEnabled:
      return (
        <div>
          <Typography>SafeNet is not enabled. Enable it to enhance your Safe experience.</Typography>
          <Button
            variant="contained"
            onClick={() =>
              setTxFlow(
                <EnableSafenetFlow guardAddress={safeNetGuardAddress} tokensForPresetAllowances={safeNetAssets} />,
              )
            }
            sx={{ mt: 2 }}
          >
            Enable
          </Button>
        </div>
      )
    case safeNetOffchainStatusLoading:
      return <CircularProgress />
    default:
      return null
  }
}

const SafeNetPage: NextPage = () => {
  const { safe, safeLoaded } = useSafeInfo()
  const { data: safeNetConfig, isLoading: safeNetConfigLoading, error: safeNetConfigError } = useGetSafeNetConfigQuery()

  if (!safeLoaded || safeNetConfigLoading) {
    return <CircularProgress />
  }

  if (safeNetConfigError) {
    return <Typography>Error loading SafeNet config</Typography>
  }

  if (!safeNetConfig) {
    // Should never happen, making TS happy
    return <Typography>No SafeNet config found</Typography>
  }

  const safeNetContent = <SafeNetContent safeNetConfig={safeNetConfig} safe={safe} />

  return (
    <>
      <Head>
        <title>{'Safe{Wallet} – Settings – SafeNet'}</title>
      </Head>

      <SettingsHeader />

      <main>
        <Paper data-testid="setup-section" sx={{ p: 4, mb: 2 }}>
          <Grid container spacing={3}>
            <Grid item lg={4} xs={12}>
              <Typography variant="h4" fontWeight={700}>
                <Tooltip
                  placement="top"
                  title="SafeNet enhances your Safe experience by providing additional security features."
                >
                  <span>
                    SafeNet Status
                    <SvgIcon
                      component={InfoIcon}
                      inheritViewBox
                      fontSize="small"
                      color="border"
                      sx={{ verticalAlign: 'middle', ml: 0.5 }}
                    />
                  </span>
                </Tooltip>
              </Typography>
            </Grid>

            <Grid item xs>
              {safeNetContent}
            </Grid>
          </Grid>
        </Paper>
      </main>
    </>
  )
}

export default SafeNetPage
