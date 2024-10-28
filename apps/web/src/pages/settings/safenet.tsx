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
import type { SafenetConfigEntity } from '@/store/safenet'
import {
  useLazyGetSafenetOffchainStatusQuery,
  useRegisterSafenetMutation,
  useGetSafenetConfigQuery,
} from '@/store/safenet'
import type { ExtendedSafeInfo } from '@/store/safeInfoSlice'
import { SAFE_FEATURES } from '@safe-global/protocol-kit/dist/src/utils'
import { hasSafeFeature } from '@/utils/safe-versions'
import { SafenetChainType, isSupportedChain } from '@/utils/safenet'
import { getRTKErrorMessage } from '@/utils/redux-toolkit-query'

const getSafenetTokensByChain = (chainId: number, safenetConfig: SafenetConfigEntity): string[] => {
  const tokenSymbols = Object.keys(safenetConfig.tokens)

  const tokens: string[] = []
  for (const symbol of tokenSymbols) {
    const tokenAddress = safenetConfig.tokens[symbol][chainId]
    if (tokenAddress) {
      tokens.push(tokenAddress)
    }
  }

  return tokens
}

const SafenetContent = ({ safenetConfig, safe }: { safenetConfig: SafenetConfigEntity; safe: ExtendedSafeInfo }) => {
  const isVersionWithGuards = hasSafeFeature(SAFE_FEATURES.SAFE_TX_GUARDS, safe.version)
  const safenetGuardAddress = safenetConfig.guards[safe.chainId]
  const safenetProcessorAddress = safenetConfig.processors[safe.chainId]
  const isSafenetGuardEnabled = isVersionWithGuards && sameAddress(safe.guard?.value, safenetGuardAddress)
  const chainSupported = isSupportedChain(Number(safe.chainId), safenetConfig, SafenetChainType.SOURCE)
  const { setTxFlow } = useContext(TxModalContext)

  // Lazy query because running it on unsupported chain throws an error
  const [
    triggerGetSafenetOffchainStatus,
    {
      data: safenetOffchainStatus,
      error: safenetOffchainStatusError,
      isLoading: safenetOffchainStatusLoading,
      status: safenetOffchainStatusStatus,
    },
  ] = useLazyGetSafenetOffchainStatusQuery()

  // @ts-expect-error bad types. We don't want 404 to be an error - it just means that the safe is not registered
  const offchainLookupError = safenetOffchainStatusError?.status === 404 ? null : safenetOffchainStatusError
  const registeredOffchainStatus =
    !offchainLookupError && sameAddress(safenetOffchainStatus?.guard, safenetGuardAddress)

  const safenetStatusQueryWorked =
    safenetOffchainStatusStatus === QueryStatus.fulfilled || safenetOffchainStatusStatus === QueryStatus.rejected
  const needsRegistration = safenetStatusQueryWorked && isSafenetGuardEnabled && !registeredOffchainStatus
  const [registerSafenet, { error: registerSafenetError }] = useRegisterSafenetMutation()
  const error = offchainLookupError || registerSafenetError
  const safenetAssets = useMemo(
    () => getSafenetTokensByChain(Number(safe.chainId), safenetConfig),
    [safe.chainId, safenetConfig],
  )

  if (error) {
    throw getRTKErrorMessage(error)
  }

  useEffect(() => {
    if (needsRegistration) {
      registerSafenet({ chainId: safe.chainId, safeAddress: safe.address.value })
    }
  }, [needsRegistration, registerSafenet, safe.chainId, safe.address.value])

  useEffect(() => {
    if (chainSupported) {
      triggerGetSafenetOffchainStatus({ chainId: safe.chainId, safeAddress: safe.address.value })
    }
  }, [chainSupported, triggerGetSafenetOffchainStatus, safe.chainId, safe.address.value])

  switch (true) {
    case !chainSupported:
      return (
        <Typography>
          Safenet is not supported on this chain. List of supported chains ids:{' '}
          {safenetConfig.chains.sources.join(', ')}
        </Typography>
      )
    case !isVersionWithGuards:
      return <Typography>Please upgrade your Safe to the latest version to use Safenet</Typography>
    case isSafenetGuardEnabled:
      return <Typography>Safenet is enabled. Enjoy your unified experience.</Typography>
    case !isSafenetGuardEnabled:
      return (
        <div>
          <Typography>Safenet is not enabled. Enable it to enhance your Safe experience.</Typography>
          <Button
            variant="contained"
            onClick={() =>
              setTxFlow(
                <EnableSafenetFlow
                  guardAddress={safenetGuardAddress}
                  tokensForPresetAllowances={safenetAssets}
                  allowanceSpender={safenetProcessorAddress}
                />,
              )
            }
            sx={{ mt: 2 }}
          >
            Enable
          </Button>
        </div>
      )
    case safenetOffchainStatusLoading:
      return <CircularProgress />
    default:
      return null
  }
}

const SafenetPage: NextPage = () => {
  const { safe, safeLoaded } = useSafeInfo()
  const { data: safenetConfig, isLoading: safenetConfigLoading, error: safenetConfigError } = useGetSafenetConfigQuery()

  if (!safeLoaded || safenetConfigLoading) {
    return <CircularProgress />
  }

  if (safenetConfigError) {
    return <Typography>Error loading Safenet config</Typography>
  }

  if (!safenetConfig) {
    // Should never happen, making TS happy
    return <Typography>No Safenet config found</Typography>
  }

  const safenetContent = <SafenetContent safenetConfig={safenetConfig} safe={safe} />

  return (
    <>
      <Head>
        <title>{'Safe{Wallet} – Settings – Safenet'}</title>
      </Head>

      <SettingsHeader />

      <main>
        <Paper data-testid="setup-section" sx={{ p: 4, mb: 2 }}>
          <Grid container spacing={3}>
            <Grid item lg={4} xs={12}>
              <Typography variant="h4" fontWeight={700}>
                <Tooltip
                  placement="top"
                  title="Safenet enhances your Safe experience by providing additional security features."
                >
                  <span>
                    Safenet Status
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
              {safenetContent}
            </Grid>
          </Grid>
        </Paper>
      </main>
    </>
  )
}

export default SafenetPage
