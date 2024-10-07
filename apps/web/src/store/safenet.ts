import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { SAFENET_API_URL } from '@/config/constants'

export type SafenetSafeEntity = {
  safe: string
  chainId: number
  guard: string
}

export type SafenetConfigEntity = {
  chains: {
    sources: number[]
    destinations: number[]
  }
  guards: Record<string, string>
  tokens: Record<string, Record<string, string>>
}

export const safenetApi = createApi({
  reducerPath: 'safenetApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${SAFENET_API_URL}/safenet` }),
  tagTypes: ['SafeNetOffchainStatus'],
  endpoints: (builder) => ({
    getSafenetConfig: builder.query<SafenetConfigEntity, void>({
      query: () => `/config/`,
    }),
    getSafeNetOffchainStatus: builder.query<SafenetSafeEntity, { chainId: string; safeAddress: string }>({
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
  }),
})

export const { useLazyGetSafeNetOffchainStatusQuery, useRegisterSafeNetMutation, useGetSafenetConfigQuery } = safenetApi
