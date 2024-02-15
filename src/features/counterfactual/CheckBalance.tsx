import ExternalLink from '@/components/common/ExternalLink'
import { ActivateAccountButton } from '@/features/counterfactual/ActivateAccountFlow'
import { useCurrentChain } from '@/hooks/useChains'
import useSafeInfo from '@/hooks/useSafeInfo'
import { getBlockExplorerLink } from '@/utils/chains'
import { Alert, Typography } from '@mui/material'

const CheckBalance = () => {
  const { safe, safeAddress } = useSafeInfo()
  const chain = useCurrentChain()

  if (safe.deployed) return null

  const blockExplorerLink = chain ? getBlockExplorerLink(chain, safeAddress) : undefined

  return (
    <Alert icon={false} severity="info" sx={{ display: 'flex', maxWidth: '600px', mt: 3, px: 3, py: 2, mx: 'auto' }}>
      <Typography fontWeight="bold" mb={1}>
        Don&apos;t see your tokens?
      </Typography>
      <Typography variant="body2" mb={2}>
        Your Safe Account is not activated yet so we can only display your native balance. Finish the onboarding to
        deploy your account onchain and unlock all features.{' '}
        {blockExplorerLink && (
          <>
            You can always view all of your assets on the{' '}
            <ExternalLink href={blockExplorerLink.href}>Block Explorer</ExternalLink>
          </>
        )}
      </Typography>

      <ActivateAccountButton />
    </Alert>
  )
}

export default CheckBalance
