import { getCounterfactualBalance } from '@/features/counterfactual/utils'
import { useWeb3 } from '@/hooks/wallets/web3'
import { useEffect, useMemo } from 'react'
import { getBalances, type SafeBalanceResponse } from '@safe-global/safe-gateway-typescript-sdk'
import { useAppSelector } from '@/store'
import useAsync, { type AsyncResult } from '../useAsync'
import { Errors, logError } from '@/services/exceptions'
import { selectCurrency, selectSettings, TOKEN_LISTS } from '@/store/settingsSlice'
import { useCurrentChain } from '../useChains'
import { FEATURES, hasFeature } from '@/utils/chains'
import { POLLING_INTERVAL } from '@/config/constants'
import useIntervalCounter from '../useIntervalCounter'
import useSafeInfo from '../useSafeInfo'
import { useGetSafeNetConfigQuery } from '@/store/safenet'
import { SafenetChainType, convertSafeNetBalanceToSafeClientGatewayBalance, isSupportedChain } from '@/utils/safenet'
import { getSafeNetBalances } from '@/store/safenet'

export const useTokenListSetting = (): boolean | undefined => {
  const chain = useCurrentChain()
  const settings = useAppSelector(selectSettings)

  const isTrustedTokenList = useMemo(() => {
    if (settings.tokenList === TOKEN_LISTS.ALL) return false
    return chain ? hasFeature(chain, FEATURES.DEFAULT_TOKENLIST) : undefined
  }, [chain, settings.tokenList])

  return isTrustedTokenList
}

const mergeBalances = (balance1: SafeBalanceResponse, balance2: SafeBalanceResponse): SafeBalanceResponse => {
  return {
    fiatTotal: balance1.fiatTotal + balance2.fiatTotal,
    items: [...balance1.items, ...balance2.items],
  }
}

export const useLoadBalances = (): AsyncResult<SafeBalanceResponse> => {
  const [pollCount, resetPolling] = useIntervalCounter(POLLING_INTERVAL)
  const {
    data: safeNetConfig,
    isSuccess: isSafeNetConfigSuccess,
    isLoading: isSafeNetConfigLoading,
  } = useGetSafeNetConfigQuery()
  const currency = useAppSelector(selectCurrency)
  const isTrustedTokenList = useTokenListSetting()
  const { safe, safeAddress } = useSafeInfo()
  const web3 = useWeb3()
  const chain = useCurrentChain()
  const chainId = safe.chainId
  const chainSupportedBySafeNet =
    isSafeNetConfigSuccess && isSupportedChain(Number(chainId), safeNetConfig, SafenetChainType.DESTINATION)

  // Re-fetch assets when the entire SafeInfo updates
  const [data, error, loading] = useAsync<SafeBalanceResponse | undefined>(
    () => {
      if (!chainId || !safeAddress || isTrustedTokenList === undefined || isSafeNetConfigLoading) return

      if (!safe.deployed) {
        return getCounterfactualBalance(safeAddress, web3, chain)
      }

      const balanceQueries = [
        getBalances(chainId, safeAddress, currency, {
          trusted: isTrustedTokenList,
        }),
      ]

      if (isSafeNetConfigSuccess && chainSupportedBySafeNet) {
        balanceQueries.push(
          getSafeNetBalances(chainId, safeAddress)
            .then((safenetBalances) =>
              convertSafeNetBalanceToSafeClientGatewayBalance(safenetBalances, safeNetConfig, Number(chainId)),
            )
            .catch(() => ({
              fiatTotal: '0',
              items: [],
            })),
        )
      }

      return Promise.all(balanceQueries).then(([cgw, sn]) => (sn ? mergeBalances(cgw, sn) : cgw))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      safeAddress,
      chainId,
      currency,
      isTrustedTokenList,
      pollCount,
      safe.deployed,
      web3,
      chain,
      safeNetConfig,
      isSafeNetConfigSuccess,
      isSafeNetConfigLoading,
      chainSupportedBySafeNet,
    ],
    false, // don't clear data between polls
  )
  // Reset the counter when safe address/chainId changes
  useEffect(() => {
    resetPolling()
  }, [resetPolling, safeAddress, chainId])

  // Log errors
  useEffect(() => {
    if (error) {
      logError(Errors._601, error.message)
    }
  }, [error])

  return [data, error, loading || isSafeNetConfigLoading]
}

export default useLoadBalances
