import { http, HttpResponse } from 'msw'
import { mockBalanceData, mockNFTData } from './mocks'
import { GATEWAY_URL } from '../config/constants'

export const handlers = [
  http.get(`${GATEWAY_URL}//v1/chains/1/safes/0x123/balances/USD`, () => {
    return HttpResponse.json(mockBalanceData)
  }),
  http.get(`${GATEWAY_URL}//v2/chains/:chainId/safes/:safeAddress/collectibles`, () => {
    return HttpResponse.json(mockNFTData)
  }),
]
