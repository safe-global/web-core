import React from 'react'
import { Avatar, Theme, View } from 'tamagui'
import { IconProps, SafeFontIcon } from '../SafeFontIcon/SafeFontIcon'

interface LogoProps {
  logoUri?: string | null
  accessibilityLabel?: string
  fallbackIcon?: IconProps['name']
  imageBackground?: string
  size?: string
}

export function Logo({
  logoUri,
  accessibilityLabel,
  size = '$10',
  imageBackground = '$color',
  fallbackIcon = 'nft',
}: LogoProps) {
  return (
    <Theme name="logo">
      <Avatar circular size={size}>
        {logoUri && (
          <Avatar.Image
            testID="logo-image"
            backgroundColor={imageBackground}
            accessibilityLabel={accessibilityLabel}
            source={{ uri: logoUri }}
          />
        )}

        <Avatar.Fallback backgroundColor="$background">
          <View backgroundColor="$background" padding="$2" borderRadius={100}>
            <SafeFontIcon testID="logo-fallback-icon" name={fallbackIcon} color="$colorSecondary" />
          </View>
        </Avatar.Fallback>
      </Avatar>
    </Theme>
  )
}
