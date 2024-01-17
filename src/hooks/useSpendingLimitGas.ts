import useWallet from '@/hooks/wallets/useWallet'
import { useWeb3 } from '@/hooks/wallets/web3'
import { getSpendingLimitContract } from '@/services/contracts/spendingLimitContracts'
import useAsync from '@/hooks/useAsync'
import { type SpendingLimitTxParams } from '@/components/tx-flow/flows/TokenTransfer/ReviewSpendingLimitTx'
import useChainId from '@/hooks/useChainId'

const useSpendingLimitGas = (params: SpendingLimitTxParams) => {
  const chainId = useChainId()
  const provider = useWeb3()
  const wallet = useWallet()

  const [gasLimit, gasLimitError, gasLimitLoading] = useAsync<bigint | undefined>(async () => {
    if (!provider || !wallet) return

    const signer = await provider.getSigner()

    const contract = getSpendingLimitContract(chainId, signer)

    return contract.executeAllowanceTransfer.estimateGas(
      params.safeAddress,
      params.token,
      params.to,
      params.amount,
      params.paymentToken,
      params.payment,
      params.delegate,
      params.signature,
    )
  }, [provider, wallet, chainId, params])

  return { gasLimit, gasLimitError, gasLimitLoading }
}

export default useSpendingLimitGas
