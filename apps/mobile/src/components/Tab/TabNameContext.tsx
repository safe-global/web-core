import { createContext, useContext } from 'react'

export const TabNameContext = createContext<{ tabName: string }>({ tabName: '' })

export const useTabNameContext = () => {
  const context = useContext(TabNameContext)
  if (!context) {
    throw new Error('useTabNameContext must be inside a TabNameContext')
  }
  return context
}
