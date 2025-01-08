import type { ReactNode } from 'react'
import { Alert, AlertTitle, Box, Divider, Stack, Typography } from '@mui/material'
import semverSatisfies from 'semver/functions/satisfies'
import { LATEST_SAFE_VERSION } from '@/config/constants'
import { useCurrentChain } from '@/hooks/useChains'
import useSafeInfo from '@/hooks/useSafeInfo'
import { useQueuedTxsLength } from '@/hooks/useTxQueue'
import ExternalLink from '@/components/common/ExternalLink'
import { maybePlural } from '@/utils/formatters'
import madProps from '@/utils/mad-props'

const QUEUE_WARNING_VERSION = '<1.3.0'

function BgBox({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <Box
      flex={1}
      bgcolor={light ? 'background.light' : 'border.background'}
      p={2}
      textAlign="center"
      fontWeight={700}
      fontSize={18}
      borderRadius={1}
    >
      {children}
    </Box>
  )
}

export function _UpdateSafe({
  safeVersion,
  queueSize,
  chain,
}: {
  safeVersion: string
  queueSize: string
  chain: ReturnType<typeof useCurrentChain>
}) {
  const showQueueWarning = queueSize && semverSatisfies(safeVersion, QUEUE_WARNING_VERSION)
  const latestSafeVersion = chain?.recommendedMasterCopyVersion || LATEST_SAFE_VERSION

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2}>
        <BgBox>Current version: {safeVersion}</BgBox>
        <Box fontSize={28}>→</Box>
        <BgBox light>New version: {latestSafeVersion}</BgBox>
      </Stack>

      <Typography>
        Read about the updates in the new Safe contracts version in the{' '}
        <ExternalLink href={`https://github.com/safe-global/safe-contracts/releases/tag/v${latestSafeVersion}`}>
          version {latestSafeVersion} changelog
        </ExternalLink>
      </Typography>

      {showQueueWarning && (
        <Alert severity="warning">
          <AlertTitle sx={{ fontWeight: 700 }}>This upgrade will invalidate all queued transactions!</AlertTitle>
          You have {queueSize} unexecuted transaction{maybePlural(parseInt(queueSize))}. Please make sure to execute or
          delete them before upgrading, otherwise you&apos;ll have to reject or replace them after the upgrade.
        </Alert>
      )}

      <Divider sx={{ my: 1, mx: -3 }} />
    </>
  )
}

function useSafeVersion() {
  const { safe } = useSafeInfo()
  return safe?.version || ''
}

const UpdateSafe = madProps(_UpdateSafe, {
  chain: useCurrentChain,
  safeVersion: useSafeVersion,
  queueSize: useQueuedTxsLength,
})

export default UpdateSafe
