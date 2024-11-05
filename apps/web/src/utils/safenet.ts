import type { SafenetBalanceEntity, SafenetConfigEntity } from '@/store/safenet'
import { TokenType, type SafeBalanceResponse } from '@safe-global/safe-gateway-typescript-sdk'

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

    const decimals = tokenName === 'USDC' || tokenName === 'USDT' ? 6 : 18

    balances.items.push({
      tokenInfo: {
        type: TokenType.ERC20,
        address: tokenAddress,
        decimals,
        symbol: tokenName,
        name: `${tokenName} (Safenet)`,
        logoUri: `https://assets.smold.app/api/token/${chainId}/${tokenAddress}/logo-128.png`,
      },
      balance,
      fiatBalance: ((parseInt(balance) * 1) / 10 ** decimals).toString(),
      fiatConversion: '1.00',
    })
  }

  return balances
}

export { convertSafenetBalanceToSafeClientGatewayBalance }
