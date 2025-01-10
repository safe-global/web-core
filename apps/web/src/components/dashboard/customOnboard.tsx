import React from 'react'
import Onboard from '@web3-onboard/core'
import walletConnectModule from '@web3-onboard/walletconnect'

const wcV2InitOptions = {
  projectId: '818ba7e312e2223f49a7dbcf88b1d409',
  requiredChains: [1, 137], // ETH Mainnet & Polygon
}

const walletConnect = walletConnectModule(wcV2InitOptions)

const onboard = Onboard({
  wallets: [walletConnect],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/your-infura-key',
    },
    {
      id: '0x89',
      token: 'MATIC',
      label: 'Polygon',
      rpcUrl: 'https://polygon-rpc.com',
    },
  ],
})

function QRCodePOC() {
  const openWallet = async () => {
    try {
      const wallets = await onboard.connectWallet({
        autoSelect: {
          label: 'WalletConnect',
          disableModals: true,
        },
      })

      console.log((wallets[0]?.provider as any)?.connector?.uri)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  return <button onClick={openWallet}>open wallet</button>
}

export default QRCodePOC
