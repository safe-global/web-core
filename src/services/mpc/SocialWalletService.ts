import { COREKIT_STATUS, type Web3AuthMPCCoreKit } from '@web3auth/mpc-core-kit'
import BN from 'bn.js'
import { GOOGLE_CLIENT_ID, WEB3AUTH_AGGREGATE_VERIFIER_ID, WEB3AUTH_SUBVERIFIER_ID } from '@/config/constants'
import { SecurityQuestionRecovery } from '@/services/mpc/recovery/SecurityQuestionRecovery'
import { trackEvent } from '@/services/analytics'
import { MPC_WALLET_EVENTS } from '@/services/analytics/events/mpcWallet'
import { DeviceShareRecovery } from '@/services/mpc/recovery/DeviceShareRecovery'
import { logError } from '../exceptions'
import ErrorCodes from '../exceptions/ErrorCodes'
import { asError } from '../exceptions/utils'
import { type ISocialWalletService } from './interfaces'

/**
 * Singleton Service for accessing the social login wallet
 */
class SocialWalletService implements ISocialWalletService {
  private mpcCoreKit: Web3AuthMPCCoreKit
  private onConnect: () => Promise<void> = () => Promise.resolve()

  private deviceShareRecovery: DeviceShareRecovery
  private securityQuestionRecovery: SecurityQuestionRecovery

  constructor(mpcCoreKit: Web3AuthMPCCoreKit) {
    this.mpcCoreKit = mpcCoreKit
    this.deviceShareRecovery = new DeviceShareRecovery(mpcCoreKit)
    this.securityQuestionRecovery = new SecurityQuestionRecovery(mpcCoreKit)
  }

  isMFAEnabled() {
    const { shareDescriptions } = this.mpcCoreKit.getKeyDetails()
    return !Object.values(shareDescriptions).some((value) => value[0]?.includes('hashedShare'))
  }

  isRecoveryPasswordSet() {
    return this.securityQuestionRecovery.isEnabled()
  }

  async enableMFA(oldPassword: string | undefined, newPassword: string): Promise<void> {
    try {
      // 1. setup device factor with password recovery
      await this.securityQuestionRecovery.upsertPassword(newPassword, oldPassword)
      const securityQuestionFactor = await this.securityQuestionRecovery.recoverWithPassword(newPassword)
      if (!securityQuestionFactor) {
        throw Error('Problem setting up the new password')
      }

      if (!this.isMFAEnabled()) {
        trackEvent(MPC_WALLET_EVENTS.ENABLE_MFA)
        // 2. enable MFA in mpcCoreKit
        await this.mpcCoreKit.enableMFA({}, false)
      }

      await this.mpcCoreKit.commitChanges()
    } catch (e) {
      const error = asError(e)
      logError(ErrorCodes._304, error.message)
      throw error
    }
  }

  setOnConnect(onConnect: () => Promise<void>) {
    this.onConnect = onConnect
  }

  getUserInfo() {
    return this.mpcCoreKit.state.userInfo
  }

  async loginAndCreate(): Promise<COREKIT_STATUS> {
    try {
      await this.mpcCoreKit.loginWithOauth({
        aggregateVerifierIdentifier: WEB3AUTH_AGGREGATE_VERIFIER_ID,
        subVerifierDetailsArray: [
          {
            clientId: GOOGLE_CLIENT_ID,
            typeOfLogin: 'google',
            verifier: WEB3AUTH_SUBVERIFIER_ID,
          },
        ],
        aggregateVerifierType: 'single_id_verifier',
      })

      if (this.mpcCoreKit.status === COREKIT_STATUS.REQUIRED_SHARE) {
        // Check if we have a device share stored
        if (await this.deviceShareRecovery.isEnabled()) {
          await this.deviceShareRecovery.recoverWithDeviceFactor()
        } else {
          // Check password recovery
          if (this.securityQuestionRecovery.isEnabled()) {
            trackEvent(MPC_WALLET_EVENTS.MANUAL_RECOVERY)
            return this.mpcCoreKit.status
          }
        }
      }

      await this.finalizeLogin()
      return this.mpcCoreKit.status
    } catch (error) {
      console.error(error)
      return this.mpcCoreKit.status
    }
  }

  private async finalizeLogin() {
    if (this.mpcCoreKit.status === COREKIT_STATUS.LOGGED_IN) {
      await this.mpcCoreKit.commitChanges()
      await this.mpcCoreKit.provider?.request({ method: 'eth_accounts', params: [] })
      await this.onConnect()
    }
  }

  async recoverAccountWithPassword(password: string, storeDeviceShare: boolean = false) {
    if (this.securityQuestionRecovery.isEnabled()) {
      const factorKeyString = await this.securityQuestionRecovery.recoverWithPassword(password)
      const factorKey = new BN(factorKeyString, 'hex')
      await this.mpcCoreKit.inputFactorKey(factorKey)

      if (storeDeviceShare) {
        await this.deviceShareRecovery.createAndStoreDeviceFactor()
      }

      await this.finalizeLogin()
    }

    return this.mpcCoreKit.status === COREKIT_STATUS.LOGGED_IN
  }

  async exportSignerKey(password: string): Promise<string> {
    try {
      if (this.securityQuestionRecovery.isEnabled()) {
        // Only export PK if recovery works
        await this.securityQuestionRecovery.recoverWithPassword(password)
      }
      const exportedPK = await this.mpcCoreKit?._UNSAFE_exportTssKey()
      return exportedPK
    } catch (err) {
      throw new Error('Error exporting account. Make sure the password is correct.')
    }
  }

  async __deleteAccount() {
    // This is a critical function that should only be used for testing purposes
    // Resetting your account means clearing all the metadata associated with it from the metadata server
    // The key details will be deleted from our server and you will not be able to recover your account
    if (!this.mpcCoreKit?.metadataKey) {
      throw new Error('MPC Core Kit is not initialized or the user is not logged in')
    }

    // In web3auth an account is reset by overwriting the metadata with KEY_NOT_FOUND
    await this.mpcCoreKit.tKey.storageLayer.setMetadata({
      privKey: new BN(this.mpcCoreKit.metadataKey, 'hex'),
      input: { message: 'KEY_NOT_FOUND' },
    })
  }
}

export default SocialWalletService
