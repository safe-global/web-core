import { getAvailableSaltNonce } from '@/components/new-safe/create/logic/utils'
import ErrorMessage from '@/components/tx/ErrorMessage'
import { createCounterfactualSafe } from '@/features/counterfactual/utils'
import useAsync from '@/hooks/useAsync'
import useWalletCanPay from '@/hooks/useWalletCanPay'
import { useAppDispatch } from '@/store'
import { FEATURES } from '@/utils/chains'
import type { BrowserProvider } from 'ethers'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { Button, Grid, Typography, Divider, Box, Alert } from '@mui/material'
import lightPalette from '@/components/theme/lightPalette'
import ChainIndicator from '@/components/common/ChainIndicator'
import EthHashInfo from '@/components/common/EthHashInfo'
import { useCurrentChain, useHasFeature } from '@/hooks/useChains'
import useGasPrice, { getTotalFee } from '@/hooks/useGasPrice'
import { useEstimateSafeCreationGas } from '@/components/new-safe/create/useEstimateSafeCreationGas'
import { formatVisualAmount } from '@/utils/formatters'
import type { StepRenderProps } from '@/components/new-safe/CardStepper/useCardStepper'
import type { NewSafeFormData } from '@/components/new-safe/create'
import css from '@/components/new-safe/create/steps/ReviewStep/styles.module.css'
import layoutCss from '@/components/new-safe/create/styles.module.css'
import { getReadOnlyFallbackHandlerContract } from '@/services/contracts/safeContracts'
import { computeNewSafeAddress } from '@/components/new-safe/create/logic'
import useWallet from '@/hooks/wallets/useWallet'
import { useWeb3 } from '@/hooks/wallets/web3'
import useSyncSafeCreationStep from '@/components/new-safe/create/useSyncSafeCreationStep'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import NetworkWarning from '@/components/new-safe/create/NetworkWarning'
import useIsWrongChain from '@/hooks/useIsWrongChain'
import ReviewRow from '@/components/new-safe/ReviewRow'
import { ExecutionMethodSelector, ExecutionMethod } from '@/components/tx/ExecutionMethodSelector'
import { MAX_HOUR_RELAYS, useLeastRemainingRelays } from '@/hooks/useRemainingRelays'
import classnames from 'classnames'
import { hasRemainingRelays } from '@/utils/relaying'
import { usePendingSafe } from '../StatusStep/usePendingSafe'
import { LATEST_SAFE_VERSION } from '@/config/constants'
import { isSocialLoginWallet } from '@/services/mpc/SocialLoginModule'
import { RELAY_SPONSORS } from '@/components/tx/SponsoredBy'
import Image from 'next/image'
import { type ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { type DeploySafeProps } from '@safe-global/protocol-kit'

export const NetworkFee = ({
  totalFee,
  chain,
  willRelay,
}: {
  totalFee: string
  chain: ChainInfo | undefined
  willRelay: boolean
}) => {
  const wallet = useWallet()

  const isSocialLogin = isSocialLoginWallet(wallet?.label)

  if (!isSocialLogin) {
    return (
      <Box
        p={1}
        sx={{
          backgroundColor: lightPalette.secondary.background,
          color: 'static.main',
          width: 'fit-content',
          borderRadius: '6px',
        }}
      >
        <Typography variant="body1" className={classnames({ [css.sponsoredFee]: willRelay })}>
          <b>
            &asymp; {totalFee} {chain?.nativeCurrency.symbol}
          </b>
        </Typography>
      </Box>
    )
  }

  if (willRelay) {
    const sponsor = RELAY_SPONSORS[chain?.chainId || ''] || RELAY_SPONSORS.default
    return (
      <>
        <Typography fontWeight="bold">Free</Typography>
        <Typography variant="body2">
          Your account is sponsored by
          <Image
            data-testid="sponsor-icon"
            src={sponsor.logo}
            alt={sponsor.name}
            width={16}
            height={16}
            style={{ margin: '-3px 0px -3px 4px' }}
          />{' '}
          {sponsor.name}
        </Typography>
      </>
    )
  }

  return (
    <Alert severity="error">
      You have used up your {MAX_HOUR_RELAYS} free transactions per hour. Please try again later.
    </Alert>
  )
}

const useGetDeployProps = (data: NewSafeFormData, provider?: BrowserProvider, chain?: ChainInfo) => {
  return useAsync(
    async () => {
      if (!chain || !provider) return

      const readOnlyFallbackHandlerContract = await getReadOnlyFallbackHandlerContract(
        chain.chainId,
        LATEST_SAFE_VERSION,
      )

      const deploySafeProps: DeploySafeProps = {
        safeAccountConfig: {
          threshold: data.threshold,
          owners: data.owners.map((owner) => owner.address),
          fallbackHandler: await readOnlyFallbackHandlerContract.getAddress(),
        },
      }

      const saltNonce = await getAvailableSaltNonce(provider, { ...deploySafeProps, saltNonce: '0' })
      const safeAddress = await computeNewSafeAddress(provider, { ...deploySafeProps, saltNonce })

      return { saltNonce, safeAddress, deploySafeProps }
    },
    [chain, data.owners, data.threshold, provider],
    false,
  )
}

const ReviewStep = ({ data, onSubmit, onBack, setStep }: StepRenderProps<NewSafeFormData>) => {
  const isWrongChain = useIsWrongChain()
  useSyncSafeCreationStep(setStep)
  const chain = useCurrentChain()
  const wallet = useWallet()
  const provider = useWeb3()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [gasPrice] = useGasPrice()
  const [_, setPendingSafe] = usePendingSafe()
  const [executionMethod, setExecutionMethod] = useState(ExecutionMethod.RELAY)
  const [submitError, setSubmitError] = useState<string>()
  const isCounterfactualEnabled = useHasFeature(FEATURES.COUNTERFACTUAL)

  const ownerAddresses = useMemo(() => data.owners.map((owner) => owner.address), [data.owners])
  const [minRelays] = useLeastRemainingRelays(ownerAddresses)

  // Every owner has remaining relays and relay method is selected
  const canRelay = hasRemainingRelays(minRelays)
  const willRelay = canRelay && executionMethod === ExecutionMethod.RELAY

  const [deployProps] = useGetDeployProps(data, provider, chain)

  const safeParams = useMemo(() => {
    return {
      owners: data.owners.map((owner) => owner.address),
      threshold: data.threshold,
      saltNonce: deployProps?.saltNonce ? Number(deployProps.saltNonce) : Date.now(),
    }
  }, [data.owners, data.threshold, deployProps?.saltNonce])

  const { gasLimit } = useEstimateSafeCreationGas(safeParams)

  const maxFeePerGas = gasPrice?.maxFeePerGas
  const maxPriorityFeePerGas = gasPrice?.maxPriorityFeePerGas

  const walletCanPay = useWalletCanPay({ gasLimit, maxFeePerGas, maxPriorityFeePerGas })

  const totalFee =
    gasLimit && maxFeePerGas
      ? formatVisualAmount(getTotalFee(maxFeePerGas, maxPriorityFeePerGas, gasLimit), chain?.nativeCurrency.decimals)
      : '> 0.001'

  // Only 1 out of 1 safe setups are supported for now
  const isCounterfactual = data.threshold === 1 && data.owners.length === 1 && isCounterfactualEnabled

  const handleBack = () => {
    onBack(data)
  }

  const createSafe = async () => {
    if (!wallet || !provider || !chain) return

    if (!deployProps) {
      setSubmitError('Error creating the Safe Account. Please try again later.')
      return
    }

    const props = deployProps.deploySafeProps
    const saltNonce = deployProps.saltNonce
    const safeAddress = deployProps.safeAddress

    if (isCounterfactual) {
      createCounterfactualSafe(chain, safeAddress, saltNonce, data, dispatch, props, router)
      return
    }

    const pendingSafe = {
      ...data,
      saltNonce: Number(saltNonce),
      safeAddress,
      willRelay,
    }

    setPendingSafe(pendingSafe)
    onSubmit(pendingSafe)
  }

  const isSocialLogin = isSocialLoginWallet(wallet?.label)
  const isDisabled = isWrongChain || (isSocialLogin && !willRelay)

  return (
    <>
      <Box className={layoutCss.row}>
        <Grid container spacing={3}>
          <ReviewRow name="Network" value={<ChainIndicator chainId={chain?.chainId} inline />} />
          {data.name && <ReviewRow name="Name" value={<Typography>{data.name}</Typography>} />}
          <ReviewRow
            name="Owners"
            value={
              <Box data-testid="review-step-owner-info" className={css.ownersArray}>
                {data.owners.map((owner, index) => (
                  <EthHashInfo
                    address={owner.address}
                    name={owner.name || owner.ens}
                    shortAddress={false}
                    showPrefix={false}
                    showName
                    hasExplorer
                    showCopyButton
                    key={index}
                  />
                ))}
              </Box>
            }
          />
          <ReviewRow
            name="Threshold"
            value={
              <Typography>
                {data.threshold} out of {data.owners.length} owner(s)
              </Typography>
            }
          />
        </Grid>
      </Box>

      {!isCounterfactual && (
        <>
          <Divider />
          <Box className={layoutCss.row} display="flex" flexDirection="column" gap={3}>
            {canRelay && !isSocialLogin && (
              <Grid container spacing={3}>
                <ReviewRow
                  name="Execution method"
                  value={
                    <ExecutionMethodSelector
                      executionMethod={executionMethod}
                      setExecutionMethod={setExecutionMethod}
                      relays={minRelays}
                    />
                  }
                />
              </Grid>
            )}

            <Grid data-testid="network-fee-section" container spacing={3}>
              <ReviewRow
                name="Est. network fee"
                value={
                  <>
                    <NetworkFee totalFee={totalFee} willRelay={willRelay} chain={chain} />

                    {!willRelay && !isSocialLogin && (
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        You will have to confirm a transaction with your connected wallet.
                      </Typography>
                    )}
                  </>
                }
              />
            </Grid>

            {isWrongChain && <NetworkWarning />}

            {!walletCanPay && !willRelay && (
              <ErrorMessage>
                Your connected wallet doesn&apos;t have enough funds to execute this transaction
              </ErrorMessage>
            )}
          </Box>
        </>
      )}

      <Divider />

      <Box className={layoutCss.row}>
        {submitError && <ErrorMessage className={css.errorMessage}>{submitError}</ErrorMessage>}
        <Box display="flex" flexDirection="row" justifyContent="space-between" gap={3}>
          <Button
            data-testid="back-btn"
            variant="outlined"
            size="small"
            onClick={handleBack}
            startIcon={<ArrowBackIcon fontSize="small" />}
          >
            Back
          </Button>
          <Button
            data-testid="review-step-next-btn"
            onClick={createSafe}
            variant="contained"
            size="stretched"
            disabled={isDisabled}
          >
            Create
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default ReviewStep
