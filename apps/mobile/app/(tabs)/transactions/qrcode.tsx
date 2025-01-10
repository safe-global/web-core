import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'

import { Camera, Code, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera'
import { Text } from 'tamagui'

import { Core } from '@walletconnect/core'
import { WalletKit, WalletKitTypes } from '@reown/walletkit'

import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils'

const core = new Core({
  projectId: '818ba7e312e2223f49a7dbcf88b1d409',
})

let walletKit: Awaited<ReturnType<typeof WalletKit.init>>

const initWalletKit = async () => {
  walletKit = await WalletKit.init({
    core,
    metadata: {
      name: 'Demo React Native Wallet',
      description: 'Demo RN Wallet to interface with Dapps',
      url: 'www.walletconnect.com',
      icons: ['https://your_wallet_icon.png'],
      redirect: {
        native: 'yourwalletscheme://',
      },
    },
  })

  walletKit.on('session_proposal', async ({ id, params, ...others }: WalletKitTypes.SessionProposal) => {
    console.log('walletKit', { id, params, ...others })

    try {
      // ------- namespaces builder util ------------ //
      const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
          eip155: {
            chains: ['eip155:1', 'eip155:137', 'eip155:11155111'],
            methods: ['eth_sendTransaction', 'personal_sign'],
            events: ['accountsChanged', 'chainChanged'],
            accounts: [
              'eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb',
              'eip155:137:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb',
              'eip155:11155111:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb',
            ],
          },
        },
      })
      // ------- end namespaces builder util ------------ //

      const session = await walletKit.approveSession({
        id,
        namespaces: approvedNamespaces,
        sessionProperties: {
          signerName: 'Nevinha',
        },
      })

      console.log('session', session)
    } catch (error) {
      // Add error logging
      console.error('Session proposal error:', error)

      // Only reject if it's a user rejection, otherwise log the error
      await walletKit.rejectSession({
        id,
        reason: getSdkError('USER_REJECTED'),
      })
    }
  })
}

function QRCode() {
  const onCodeScanned = (codes: Code[]) => {
    const uri = codes[0].value

    console.log('uri', uri)

    if (uri) {
      setUri(uri)
    }
  }
  const device = useCameraDevice('back')
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned,
  })
  const [uri, setUri] = useState<string | null>()
  const { hasPermission, requestPermission } = useCameraPermission()
  useEffect(() => {
    if (!hasPermission) {
      requestPermission()
    }
  }, [])

  useEffect(() => {
    const pair = async () => {
      if (!walletKit) {
        await initWalletKit()
      }

      if (uri) {
        console.log('uri', uri)

        try {
          await walletKit.pair({ uri })
          console.log('paired')
        } catch (error) {
          console.error('Error pairing', error)
        }
      }

      console.log('walletKit pairing')
    }

    pair()
  }, [uri])

  if (!hasPermission) {
    return <Text>User has not granted permission to use the camera</Text>
  } else if (uri) {
    return <Text>{uri}</Text>
  }

  if (device == null) {
    return <Text>No camera</Text>
  }

  return <Camera style={StyleSheet.absoluteFill} codeScanner={codeScanner} device={device} isActive={true} />
}

export default QRCode
