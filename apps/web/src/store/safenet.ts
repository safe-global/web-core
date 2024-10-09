import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { SAFENET_API_URL } from '@/config/constants'

export type SafeNetSafeEntity = {
  safe: string
  chainId: number
  guard: string
}

export type SafeNetConfigEntity = {
  chains: {
    sources: number[]
    destinations: number[]
  }
  guards: Record<string, string>
  tokens: Record<string, Record<string, string>>
}

export type SafeNetBalanceEntity = {
  [tokenSymbol: string]: string
}

export const getSafeNetBalances = async (chainId: string, safeAddress: string): Promise<SafeNetBalanceEntity> => {
  const response = await fetch(`${SAFENET_API_URL}/safenet/balances/${chainId}/${safeAddress}`)
  const data = await response.json()
  return data
}

export const safenetApi = createApi({
  reducerPath: 'safenetApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${SAFENET_API_URL}/safenet` }),
  tagTypes: ['SafeNetConfig', 'SafeNetOffchainStatus', 'SafeNetBalance'],
  endpoints: (builder) => ({
    getSafeNetConfig: builder.query<SafeNetConfigEntity, void>({
      query: () => `/config/`,
      providesTags: ['SafeNetConfig'],
    }),
    getSafeNetOffchainStatus: builder.query<SafeNetSafeEntity, { chainId: string; safeAddress: string }>({
      query: ({ chainId, safeAddress }) => `/safes/${chainId}/${safeAddress}`,
      providesTags: (_, __, arg) => [{ type: 'SafeNetOffchainStatus', id: arg.safeAddress }],
    }),
    registerSafeNet: builder.mutation<boolean, { chainId: string; safeAddress: string }>({
      query: ({ chainId, safeAddress }) => ({
        url: `/register`,
        method: 'POST',
        body: {
          chainId: Number(chainId),
          safe: safeAddress,
        },
      }),
      invalidatesTags: (_, __, arg) => [{ type: 'SafeNetOffchainStatus', id: arg.safeAddress }],
    }),
    getSafeNetBalance: builder.query<SafeNetBalanceEntity, { chainId: string; safeAddress: string }>({
      query: ({ chainId, safeAddress }) => `/balances/${chainId}/${safeAddress}`,
      providesTags: (_, __, arg) => [{ type: 'SafeNetBalance', id: arg.safeAddress }],
    }),
  }),
})

export const {
  useLazyGetSafeNetOffchainStatusQuery,
  useRegisterSafeNetMutation,
  useGetSafeNetConfigQuery,
  useLazyGetSafeNetBalanceQuery,
} = safenetApi
