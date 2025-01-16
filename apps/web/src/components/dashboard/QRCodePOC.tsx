import React, { useCallback, useState } from 'react'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { QRCodeSVG } from 'qrcode.react'
import { ethers } from 'ethers'

async function createProvider() {
  try {
    const provider = await EthereumProvider.init({
      projectId: '818ba7e312e2223f49a7dbcf88b1d409',
      chains: [1, 137],
      methods: ['eth_sendTransaction', 'eth_accounts', 'eth_requestAccounts', 'personal_sign', 'eth_chainId'],
      events: ['chainChanged', 'accountsChanged', 'custom_wallet_event'],
      metadata: {
        description: 'my address here',
        name: 'My safe Name',
        url: 'http://safe.com',
        icons: [],
      },
      showQrModal: false,
    })

    return provider
  } catch (error) {
    console.error('Failed to create connection:', error)
    return null
  }
}

function QRCodePOC() {
  const [uri, setUri] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  const handleConnect = useCallback(async () => {
    const init = async () => {
      const provider = await createProvider()

      if (!provider) return

      provider.on('display_uri', (uri: string) => {
        setUri(uri)
      })
      const handler = (...props: any[]) => {
        console.log('### Hanldler: ', props)
      }
      // chain changed
      provider.on('chainChanged', handler)
      // accounts changed
      provider.on('accountsChanged', (accounts: string[]) => {
        console.log('### accountsChanged: ', accounts)
      })

      // Listen for session responses

      // session established
      provider.on('connect', async () => {
        setConnected(true)

        // Send custom event after connection

        try {
          // First, let's get the accounts to verify the connection
          const accounts = await provider.request({
            method: 'eth_requestAccounts',
          })
          console.log('Connected accounts:', accounts)

          // Then try to get the network version
          const chainId = await provider.request({
            method: 'eth_chainId',
          })
          console.log('Current chainId:', chainId)

          // Send custom event through the connector
          // Send it using personal_sign
          const result = await provider.request({
            method: 'personal_sign',
            params: [
              ethers.hexlify(
                ethers.toUtf8Bytes(
                  JSON.stringify({
                    name: 'Nevinha',
                    message: 'Hello from dApp!',
                    timestamp: Date.now(),
                  }),
                ),
              ),
              accounts[0],
            ],
          })

          console.log('Result:', result)
          // // If you want to send a message, you can use personal_sign
          // const message = 'Hello from dApp!'
          // const msgParams = [ethers.hexlify(ethers.toUtf8Bytes(message)), accounts[0]]

          // const result = await provider.request({
          //   method: 'personal_sign',
          //   params: msgParams,
          // })
          // console.log('Message signed:', result)
        } catch (error) {
          console.error('Failed to interact with wallet:', error)
        }
      })
      // session event - chainChanged/accountsChanged/custom events
      provider.on('session_event', handler)
      // connection uri
      // session disconnect
      provider.on('disconnect', handler)

      provider.connect()
    }
    init()
  }, [])

  return (
    <div>
      <button onClick={handleConnect}>Connect Wallet</button>
      {uri && !connected && <QRCodeSVG value={uri} size={256} />}

      {connected && <h2>YOU ARE CONNECTED</h2>}
    </div>
  )
}

export default QRCodePOC
