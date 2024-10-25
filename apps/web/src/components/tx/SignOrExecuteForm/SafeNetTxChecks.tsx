import { type ReactElement, useContext } from 'react'
import { SafeNetTxSimulation } from '@/components/tx/security/safenet'
import TxCard from '@/components/tx-flow/common/TxCard'
import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'
import useIsSafeNetEnabled from '@/hooks/useIsSafeNetEnabled'
import { Typography } from '@mui/material'
import useChainId from '@/hooks/useChainId'
import useSafeAddress from '@/hooks/useSafeAddress'

const SafeNetTxChecks = (): ReactElement | null => {
  const safe = useSafeAddress()
  const chainId = useChainId()
  const { safeTx } = useContext(SafeTxContext)
  const isSafeNetEnabled = useIsSafeNetEnabled()

  if (!isSafeNetEnabled) {
    return null
  }

  return (
    <TxCard>
      <Typography variant="h5">SafeNet checks</Typography>

      <SafeNetTxSimulation safe={safe} chainId={chainId} safeTx={safeTx} />
    </TxCard>
  )
}

export default SafeNetTxChecks
