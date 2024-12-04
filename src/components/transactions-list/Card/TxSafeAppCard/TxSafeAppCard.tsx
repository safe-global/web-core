import React from 'react'
import { Avatar, Text, View } from 'tamagui'
import { SafeListItem } from '@/src/components/SafeListItem'
import { SafeFontIcon } from '@/src/components/SafeFontIcon/SafeFontIcon'
import type { MultiSend } from '@/src/store/gateway/types'
import type { SafeAppInfo, Transaction } from '@/src/store/gateway/AUTO_GENERATED/transactions'

interface TxSafeAppCardProps {
  safeAppInfo: SafeAppInfo
  txInfo: MultiSend
  bordered?: boolean
  inQueue?: boolean
  executionInfo?: Transaction['executionInfo']
}

export function TxSafeAppCard({ safeAppInfo, executionInfo, txInfo, inQueue, bordered }: TxSafeAppCardProps) {
  return (
    <SafeListItem
      label={safeAppInfo.name}
      inQueue={inQueue}
      icon="transaction-contract"
      type="Safe app"
      bordered={bordered}
      executionInfo={executionInfo}
      leftNode={
        <Avatar circular size="$10">
          {safeAppInfo.logoUri && (
            <Avatar.Image testID="safe-app-image" accessibilityLabel={safeAppInfo.name} src={safeAppInfo.logoUri} />
          )}

          <Avatar.Fallback backgroundColor="$borderLight">
            <View backgroundColor="$borderLightDark" padding="$2" borderRadius={100}>
              <SafeFontIcon testID="safe-app-fallback" name="code-blocks" color="$color" />
            </View>
          </Avatar.Fallback>
        </Avatar>
      }
      rightNode={<Text>{txInfo.methodName}</Text>}
    />
  )
}