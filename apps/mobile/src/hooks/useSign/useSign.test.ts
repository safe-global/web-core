import { act, renderHook } from '@/src/tests/test-utils'
import { asymmetricKey, keychainGenericPassword, useSign } from './useSign'
import { HDNodeWallet, Wallet } from 'ethers'
import * as Keychain from 'react-native-keychain'
import DeviceCrypto from 'react-native-device-crypto'

describe('useSign', () => {
  it('should store the private key given a private key', async () => {
    const { result } = renderHook(() => useSign())
    const { privateKey } = Wallet.createRandom()
    const spy = jest.spyOn(Keychain, 'setGenericPassword')
    const asymmetricKeySpy = jest.spyOn(DeviceCrypto, 'getOrCreateAsymmetricKey')
    const encryptSpy = jest.spyOn(DeviceCrypto, 'encrypt')

    await act(async () => {
      await result.current.storePrivateKey(privateKey)
    })

    expect(asymmetricKeySpy).toHaveBeenCalledWith(asymmetricKey, { accessLevel: 2, invalidateOnNewBiometry: true })
    expect(encryptSpy).toHaveBeenCalledWith(asymmetricKey, privateKey, {
      biometryTitle: 'Authenticate',
      biometrySubTitle: 'Saving key',
      biometryDescription: 'Please authenticate yourself',
    })
    expect(spy).toHaveBeenCalledWith(
      keychainGenericPassword,
      JSON.stringify({ encryptyedPassword: 'encryptedText', iv: `${privateKey}000` }),
    )
  })

  it('should decrypt and get the stored private key after it is encrypted', async () => {
    const { result } = renderHook(() => useSign())
    const { privateKey } = Wallet.createRandom()
    const spy = jest.spyOn(Keychain, 'setGenericPassword')
    let returnedKey = null

    // To generate the iv and wait till the hook re-renders
    await act(async () => {
      await result.current.storePrivateKey(privateKey)
    })

    await act(async () => {
      returnedKey = await result.current.getPrivateKey()
    })

    expect(spy).toHaveBeenCalledWith(
      'safeuser',
      JSON.stringify({ encryptyedPassword: 'encryptedText', iv: `${privateKey}000` }),
    )
    expect(returnedKey).toBe(privateKey)
  })

  it('should import a wallet when given a mnemonic phrase', async () => {
    const { result } = renderHook(() => useSign())
    const { mnemonic, privateKey } = Wallet.createRandom()

    // To generate the iv and wait till the hook re-renders
    await act(async () => {
      const wallet = await result.current.createMnemonicAccount(mnemonic?.phrase as string)

      expect(wallet).toBeInstanceOf(HDNodeWallet)
      expect(wallet?.privateKey).toBe(privateKey)
    })
  })
})
