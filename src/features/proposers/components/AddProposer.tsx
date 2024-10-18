import AddressInput from '@/components/common/AddressInput'
import NameInput from '@/components/common/NameInput'
import ErrorMessage from '@/components/tx/ErrorMessage'
import { getDelegateTypedData } from '@/features/proposers/utils/utils'
import useChainId from '@/hooks/useChainId'
import useSafeAddress from '@/hooks/useSafeAddress'
import useWallet from '@/hooks/wallets/useWallet'
import { getAssertedChainSigner } from '@/services/tx/tx-sender/sdk'
import { signTypedData } from '@/utils/web3'
import { Close } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from '@mui/material'
import { type BaseSyntheticEvent, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { getClient } from '@safe-global/safe-client-gateway-sdk'

// TODO: Replace once ready from the gateway-sdk
const postDelegate = (
  chainId: string,
  safeAddress: string,
  delegate: string,
  delegator: string,
  signature: string,
  label: string,
) => {
  return getClient().POST('/v2/chains/{chainId}/delegates', {
    params: { path: { chainId } },
    body: {
      safe: safeAddress,
      delegate,
      delegator,
      signature,
      label,
    },
  })
}

type AddProposerProps = {
  onClose: () => void
  onSuccess: () => void
}

type DelegateEntry = {
  name: string
  address: string
}

const AddProposer = ({ onClose, onSuccess }: AddProposerProps) => {
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const chainId = useChainId()
  const wallet = useWallet()
  const safeAddress = useSafeAddress()

  const methods = useForm<DelegateEntry>({
    mode: 'onChange',
  })

  const { handleSubmit } = methods

  const onConfirm = handleSubmit(async (data: DelegateEntry) => {
    if (!wallet) return

    setError(undefined)
    setIsLoading(true)

    try {
      const signer = await getAssertedChainSigner(wallet.provider)
      const typedData = getDelegateTypedData(chainId, data.address)

      const signature = await signTypedData(signer, typedData)
      await postDelegate(chainId, safeAddress, data.address, wallet.address, signature, data.name)
    } catch (error) {
      setIsLoading(false)
      setError(error as Error)
      return
    }

    setIsLoading(false)
    onSuccess()
  })

  const onSubmit = (e: BaseSyntheticEvent) => {
    e.stopPropagation()
    onConfirm(e)
  }

  return (
    <Dialog open onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <DialogTitle>
            <Box data-testid="untrusted-token-warning" display="flex" alignItems="center">
              <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Add delegate
              </Typography>

              <Box flexGrow={1} />

              <IconButton aria-label="close" onClick={onClose} sx={{ marginLeft: 'auto' }}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>

          <Divider />

          <DialogContent>
            <Box>
              This will add a delegate to your Safe. The delegate will be able to propose transactions but not sign
              them. A name for the delegate is required. This name will be publicly accessible.
            </Box>

            <Box my={2}>
              <NameInput label="Name" autoFocus name="name" required />
            </Box>

            <AddressInput name="address" label="Delegate" variant="outlined" fullWidth required />

            {error && (
              <Box mt={2}>
                <ErrorMessage error={error}>Error deleting proposer</ErrorMessage>
              </Box>
            )}
          </DialogContent>

          <Divider />

          <DialogActions sx={{ padding: 3, justifyContent: 'space-between' }}>
            <Button size="small" variant="text" onClick={onClose}>
              Cancel
            </Button>

            <Button
              size="small"
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoading}
              sx={{ minWidth: '122px', minHeight: '36px' }}
            >
              {isLoading ? <CircularProgress size={20} /> : 'Submit'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  )
}

export default AddProposer
