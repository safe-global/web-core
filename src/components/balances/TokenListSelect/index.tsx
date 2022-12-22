import { type ReactElement, useContext } from 'react'
import { Typography, ToggleButton, Tooltip } from '@mui/material'
import { ASSETS_EVENTS } from '@/services/analytics'
import { HiddenAssetsContext } from '../HiddenAssetsProvider'
import useHiddenTokens from '@/hooks/useHiddenTokens'
import useBalances from '@/hooks/useBalances'
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material'
import Track from '@/components/common/Track'

const TokenListSelect = (): ReactElement | null => {
  const { toggleShowHiddenAssets, showHiddenAssets } = useContext(HiddenAssetsContext)

  const { balances } = useBalances(true)
  const currentHiddenAssets = useHiddenTokens()

  const hiddenAssetCount =
    balances.items?.filter((item) => currentHiddenAssets.includes(item.tokenInfo.address)).length || 0

  if (hiddenAssetCount === 0) {
    return null
  }

  return (
    <Track {...ASSETS_EVENTS.TOGGLE_HIDDEN_ASSETS}>
      <Tooltip title="Toggle hidden assets" arrow>
        <ToggleButton
          sx={{ gap: 1, padding: 1 }}
          value="showHiddenAssets"
          onClick={toggleShowHiddenAssets}
          selected={showHiddenAssets}
          data-testid="toggle-hidden-assets"
        >
          <>
            {showHiddenAssets ? <VisibilityOffOutlined fontSize="small" /> : <VisibilityOutlined fontSize="small" />}
            <Typography fontSize="small">{hiddenAssetCount}</Typography>
          </>
        </ToggleButton>
      </Tooltip>
    </Track>
  )
}

export default TokenListSelect
