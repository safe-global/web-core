import type { Preview } from '@storybook/react'
import { NavigationIndependentTree } from '@react-navigation/native'
import { SafeThemeProvider } from '@/src/theme/provider/safeTheme'
import { View } from 'react-native'
import { SafeToastProvider } from '@/src/theme/provider/toastProvider'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { PortalProvider } from 'tamagui'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      return (
        <PortalProvider shouldAddRootHost>
          <NavigationIndependentTree>
            <SafeAreaProvider>
              <SafeThemeProvider>
                <SafeToastProvider>
                  <View style={{ padding: 16, flex: 1 }}>
                    <Story />
                  </View>
                </SafeToastProvider>
              </SafeThemeProvider>
            </SafeAreaProvider>
          </NavigationIndependentTree>
        </PortalProvider>
      )
    },
  ],
}

export default preview