import React from 'react'
import { View } from 'tamagui'
import { Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import { AssetsCard } from '@/src/components/transactions-list/Card/AssetsCard'
import { SafeFontIcon } from '@/src/components/SafeFontIcon/SafeFontIcon'
import { TouchableOpacity } from 'react-native'

interface ChainItemsProps {
  activeChain: Chain
  chains: Chain[]
  chainId: string
  fiatTotal: string
  onSelect: (chainId: string) => void
}

export function ChainItems({ chainId, chains, activeChain, fiatTotal, onSelect }: ChainItemsProps) {
  const chain = chains.find((item) => item.chainId === chainId)
  const isActive = chainId === activeChain.chainId

  const handleChainSelect = () => {
    onSelect(chainId)
  }

  if (!chain) {
    return null
  }

  return (
    <TouchableOpacity style={{ width: '100%' }} onPress={handleChainSelect}>
      <View backgroundColor={isActive ? '$borderLight' : '$backgroundTransparent'} borderRadius="$4">
        <AssetsCard
          name={chain.chainName}
          logoUri={chain.chainLogoUri}
          description={`${fiatTotal}`}
          rightNode={isActive && <SafeFontIcon name="check" color="$color" />}
        />
      </View>
    </TouchableOpacity>
  )
}
