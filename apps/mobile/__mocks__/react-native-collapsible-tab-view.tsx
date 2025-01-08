import React from 'react'
import { View, FlatList } from 'react-native'

export const Tabs = {
  Container: ({ children, renderTabBar }) => (
    <View>
      {renderTabBar && renderTabBar({ index: 0, routes: [] })}
      {children}
    </View>
  ),
  Tab: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  FlashList: FlatList,
  FlatList: FlatList,
  useTabsContext: () => ({
    focusedTab: '',
    tabNames: [],
    index: 0,
    routes: [],
    jumpTo: jest.fn(),
  }),
  useTabNameContext: () => ({ tabName: 'Tokens' }),
  ScrollView: ({ children }: { children: React.ReactNode }) => <View testID="fallback">{children}</View>,
}

export default Tabs
