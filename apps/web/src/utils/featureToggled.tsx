import type { ComponentType } from 'react'
import type { FEATURES } from '@/utils/chains'
import { useHasFeature } from '@/hooks/useChains'

export { FEATURES } from '@/utils/chains'

export const featureToggled = <P extends Record<string, unknown>>(Component: ComponentType<P>, feature: FEATURES) => {
  const ToggledComponent = (props: P) => {
    const hasFeature = useHasFeature(feature)
    return hasFeature ? <Component {...props} /> : null
  }
  ToggledComponent.displayName = Component.displayName || Component.name
  return ToggledComponent
}
