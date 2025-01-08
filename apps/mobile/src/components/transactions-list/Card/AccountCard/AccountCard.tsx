import React from 'react'
import { Text, View } from 'tamagui'
import { SafeListItem } from '@/src/components/SafeListItem'
import { ellipsis } from '@/src/utils/formatters'
import { IdenticonWithBadge } from '@/src/features/Settings/components/IdenticonWithBadge'
import { Address } from '@/src/types/address'
import { Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import { ChainsDisplay } from '@/src/components/ChainsDisplay'

interface AccountCardProps {
  name: string | Address
  balance: string
  address: Address
  owners: number
  threshold: number
  rightNode?: string | React.ReactNode
  leftNode?: React.ReactNode
  chains?: Chain[]
  spaced?: boolean
}

export function AccountCard({
  name,
  chains,
  spaced,
  owners,
  leftNode,
  balance,
  address,
  threshold,
  rightNode,
}: AccountCardProps) {
  return (
    <SafeListItem
      spaced={spaced}
      label={
        <View>
          <Text fontSize="$4" fontWeight={600}>
            {ellipsis(name, 18)}
          </Text>
          <Text fontSize="$4" color="$colorSecondary" fontWeight={400}>
            ${ellipsis(balance, 14)}
          </Text>
        </View>
      }
      leftNode={
        <View marginRight="$2" flexDirection="row" gap="$2" justifyContent="center" alignItems="center">
          {leftNode}
          <IdenticonWithBadge
            testID="threshold-info-badge"
            size={40}
            fontSize={owners > 9 ? 8 : 12}
            address={address}
            badgeContent={`${threshold}/${owners}`}
          />
        </View>
      }
      rightNode={
        <View columnGap="$2" flexDirection="row">
          {chains && <ChainsDisplay chains={chains} max={3} />}
          {rightNode}
        </View>
      }
      transparent
    />
  )
}
