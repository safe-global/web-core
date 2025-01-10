import { http, HttpResponse } from 'msw'

export const handlers = (GATEWAY_URL: string) => [
  http.get(`${GATEWAY_URL}/v1/chains/1/safes/0x123/balances/USD`, () => {
    return HttpResponse.json({
      items: [
        {
          tokenInfo: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
            logoUri: 'https://safe-transaction-assets.safe.global/chains/1/chain_logo.png',
          },
          balance: '1000000000000000000',
          fiatBalance: '2000',
        },
      ],
    })
  }),
  http.get(`${GATEWAY_URL}/v2/chains/:chainId/safes/:safeAddress/collectibles`, () => {
    return HttpResponse.json({
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: '1',
          address: '0x123',
          tokenName: 'Cool NFT',
          tokenSymbol: 'CNFT',
          logoUri: 'https://example.com/nft1.png',
          name: 'NFT #1',
          description: 'A cool NFT',
          tokenId: '1',
          uri: 'https://example.com/nft1.json',
          imageUri: 'https://example.com/nft1.png',
        },
        {
          id: '2',
          address: '0x456',
          tokenName: 'Another NFT',
          tokenSymbol: 'ANFT',
          logoUri: 'https://example.com/nft2.png',
          name: 'NFT #2',
          description: 'Another cool NFT',
          tokenId: '2',
          uri: 'https://example.com/nft2.json',
          imageUri: 'https://example.com/nft2.png',
        },
      ],
    })
  }),
]
