import type { ReactElement } from 'react'
import classnames from 'classnames'
import { useAppSelector } from '@/store'
import { selectChainById, selectChains } from '@/store/chainsSlice'
import css from './styles.module.css'
import useChainId from '@/hooks/useChainId'
import { Skeleton, Typography } from '@mui/material'
import isEmpty from 'lodash/isEmpty'

type ChainIndicatorProps = {
  chainId?: string
  inline?: boolean
  className?: string
  showUnknown?: boolean
  showLogo?: boolean
  onlyLogo?: boolean
  responsive?: boolean
  fiatValue?: string
}

const fallbackChainConfig = {
  chainName: 'Unknown chain',
  chainId: '-1',
  theme: {
    backgroundColor: '#ddd',
    textColor: '#000',
  },
  chainLogoUri: null,
}

const ChainIndicatorSafenet = ({
  chainId,
  className,
  inline = false,
  showUnknown = true,
  showLogo = true,
  responsive = false,
  onlyLogo = false,
}: ChainIndicatorProps): ReactElement | null => {
  const currentChainId = useChainId()
  const id = chainId || currentChainId
  const chains = useAppSelector(selectChains)
  const chainConfig =
    useAppSelector((state) => selectChainById(state, id)) || (showUnknown ? fallbackChainConfig : null)
  const noChains = isEmpty(chains.data)

  return noChains ? (
    <Skeleton width="100%" height="22px" variant="rectangular" sx={{ flexShrink: 0 }} />
  ) : chainConfig ? (
    <span
      data-testid="chain-logo"
      style={{
        background: 'linear-gradient(90deg, #32f970 0%, #eed509 100%)',
        color: 'var(--color-static-main)',
        borderTopLeftRadius: 'var(--space-1)',
        borderTopRightRadius: 'var(--space-1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'calc(var(--space-1) / 2) var(--space-1)',
      }}
      className={classnames(className || '', {
        [css.inlineIndicator]: inline,
        [css.indicator]: !inline,
        [css.withLogo]: showLogo,
        [css.responsive]: responsive,
        [css.onlyLogo]: onlyLogo,
      })}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--space-1) / 2)' }}>
        <img
          src={chainConfig.chainLogoUri ?? undefined}
          alt={`${chainConfig.chainName} Logo`}
          width={12}
          height={12}
          loading="lazy"
        />
        <span className={css.nameSafenet}>{chainConfig.chainName}</span>
      </span>
      <Typography variant="body2" fontWeight="bold" fontSize="12px" color="var(--color-static-main)">
        Safenet
      </Typography>
    </span>
  ) : null
}

export default ChainIndicatorSafenet
