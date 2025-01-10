import React from 'react'
import useOnboard from '@/hooks/wallets/useOnboard'

function QRCodePOC() {
  const onboard = useOnboard()
  const openWallet = async () => {
    if (!onboard) return

    try {
      onboard.state.actions.updateAppMetadata({
        name: 'Safe Account 1',
        description: '0x12312349782394',
      })

      await onboard.connectWallet({
        autoSelect: {
          label: 'WalletConnect',
          disableModals: true,
        },
      })
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  return <button onClick={openWallet}>open wallet</button>
}

export default QRCodePOC
