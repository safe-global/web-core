import type { SafenetBalanceEntity, SafenetConfigEntity } from '@/store/safenet'
import { TokenType, type SafeBalanceResponse } from '@safe-global/safe-gateway-typescript-sdk'

const enum SafenetChainType {
  SOURCE = 'source',
  DESTINATION = 'destination',
}

const isSupportedChain = (chainId: number, safenetConfig: SafenetConfigEntity, chainType: SafenetChainType) => {
  return chainType === SafenetChainType.SOURCE
    ? safenetConfig.chains.sources.includes(chainId)
    : safenetConfig.chains.destinations.includes(chainId)
}

const convertSafenetBalanceToSafeClientGatewayBalance = (
  safenetBalance: SafenetBalanceEntity,
  safenetConfig: SafenetConfigEntity,
  chainId: number,
): SafeBalanceResponse => {
  const balances: SafeBalanceResponse = {
    fiatTotal: safenetBalance.fiatTotal,
    items: [],
  }

  for (const [tokenName, balance] of Object.entries(safenetBalance)) {
    const tokenAddress = safenetConfig.tokens[tokenName][chainId]
    if (!tokenAddress) {
      continue
    }

    balances.items.push({
      tokenInfo: {
        type: TokenType.ERC20,
        address: tokenAddress,
        decimals: tokenName === 'USDC' ? 6 : 18,
        symbol: tokenName,
        name: `${tokenName} (Safenet)`,
        logoUri: '',
      },
      balance,
      fiatBalance: '0',
      fiatConversion: '0',
    })
  }

  return balances
}

export { isSupportedChain, SafenetChainType, convertSafenetBalanceToSafeClientGatewayBalance }
