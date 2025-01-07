import { useMemo, type ReactElement } from 'react'
import ImageFallback from '../ImageFallback'
import css from './styles.module.css'

const FALLBACK_ICON = '/images/common/token-placeholder.svg'
const COINGECKO_THUMB = '/thumb/'
const COINGECKO_SMALL = '/small/'

const TokenIcon = ({
  logoUri,
  tokenSymbol,
  size = 26,
  fallbackSrc,
}: {
  logoUri?: string
  tokenSymbol?: string
  size?: number
  fallbackSrc?: string
}): ReactElement => {
  const src = useMemo(() => {
    return logoUri?.replace(COINGECKO_THUMB, COINGECKO_SMALL)
  }, [logoUri])

  return (
    <ImageFallback
      src={src}
      alt={tokenSymbol}
      fallbackSrc={fallbackSrc || FALLBACK_ICON}
      height={size}
      className={css.image}
      referrerPolicy="no-referrer"
      loading="lazy"
    />
  )
}

export default TokenIcon
