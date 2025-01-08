import React from 'react'
import { H3, Text, View } from 'tamagui'
import EmptyToken from './EmptyToken'

export function NoFunds() {
  return (
    <View testID="empty-token" alignItems="center" gap="$4">
      <EmptyToken />
      <H3 fontWeight={600}>Add funds to get started</H3>
      <Text textAlign="center" color="$colorSecondary" width="70%" fontSize="$4">
        Send funds to your Safe Account from another wallet by copying your address.
      </Text>
    </View>
  )
}
