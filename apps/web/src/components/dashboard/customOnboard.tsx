import React from 'react'
import Onboard from '@web3-onboard/core'
import walletConnectModule from '@web3-onboard/walletconnect'

const walletConnect = walletConnectModule({
  projectId: '818ba7e312e2223f49a7dbcf88b1d409',
  requiredChains: [1, 137],
  version: 2,
  qrModalOptions: {
    themeMode: 'dark',
    explorerExcludedWalletIds: '*',
    enableExplorer: false,
  },
})

function QRCodePOC() {
  const onboard = Onboard({
    wallets: [walletConnect],
    chains: [
      {
        id: '0x1',
        token: 'ETH',
        label: 'Ethereum Mainnet',
        rpcUrl: 'https://mainnet.infura.io/v3/your-infura-key',
      },
    ],
    appMetadata: {
      name: 'Safe',
      icon: '<your-icon-url>',
      description: 'Safe Wallet Connection',
      recommendedInjectedWallets: [],
      explore: undefined,
    },
    connect: {
      showSidebar: false,
      disableClose: false,
    },
  })
  const openWallet = async () => {
    try {
      onboard.state.actions.updateAccountCenter({
        position: 'topLeft',
        enabled: true,
        minimal: true,
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

  return (
    <>
      <div id="connect-modal"></div>
      <button onClick={openWallet}>open wallet</button>
    </>
  )
}

export default QRCodePOC
