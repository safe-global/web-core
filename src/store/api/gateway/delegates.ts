import { buildQueryFn, gatewayApi } from '@/store/api/gateway/index'
import { type fakeBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import type { EndpointBuilder } from '@reduxjs/toolkit/dist/query/react'
import { deleteDelegateV2, postDelegateV2 } from '@safe-global/safe-client-gateway-sdk'
import { getDelegates } from '@safe-global/safe-gateway-typescript-sdk'
import type { Delegate, DelegateResponse } from '@safe-global/safe-gateway-typescript-sdk/dist/types/delegates'

export const delegateEndpoints = (
  builder: EndpointBuilder<ReturnType<typeof fakeBaseQuery<Error>>, never, 'gatewayApi'>,
) => ({
  getDelegates: builder.query<DelegateResponse, { chainId: string; safeAddress: string }>({
    queryFn({ chainId, safeAddress }) {
      return buildQueryFn(() => getDelegates(chainId, { safe: safeAddress }))
    },
  }),
  deleteDelegate: builder.mutation<
    void,
    { chainId: string; safeAddress: string; delegateAddress: string; signature: string }
  >({
    queryFn({ chainId, safeAddress, delegateAddress, signature }) {
      return buildQueryFn(() =>
        deleteDelegateV2({ params: { path: { chainId, delegateAddress } }, body: { safe: safeAddress, signature } }),
      )
    },
    // Optimistically update the cache and roll back in case the mutation fails
    async onQueryStarted({ chainId, safeAddress, delegateAddress }, { dispatch, queryFulfilled }) {
      const patchResult = dispatch(
        gatewayApi.util.updateQueryData('getDelegates', { chainId, safeAddress }, (draft) => {
          draft.results = draft.results.filter((delegate: Delegate) => delegate.delegate !== delegateAddress)
        }),
      )
      try {
        await queryFulfilled
      } catch {
        patchResult.undo()
      }
    },
  }),
  addDelegate: builder.mutation<
    Delegate,
    { chainId: string; safeAddress: string; delegate: string; delegator: string; label: string; signature: string }
  >({
    queryFn({ chainId, safeAddress, delegate, delegator, label, signature }) {
      return buildQueryFn(() =>
        postDelegateV2({
          params: { path: { chainId } },
          body: { delegate, delegator, label, signature, safe: safeAddress },
        }),
      )
    },
    // Optimistically update the cache and roll back in case the mutation fails
    async onQueryStarted({ chainId, safeAddress, delegate, delegator, label }, { dispatch, queryFulfilled }) {
      const patchResult = dispatch(
        gatewayApi.util.updateQueryData('getDelegates', { chainId, safeAddress }, (draft) => {
          draft.results.push({ delegate, delegator, label, safe: safeAddress })
        }),
      )
      try {
        await queryFulfilled
      } catch {
        patchResult.undo()
      }
    },
  }),
})