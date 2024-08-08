import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as createwallet from '../pages/create_wallet.pages'
import * as owner from '../pages/owners.pages'
import * as navigation from '../pages/navigation.page.js'
import * as ls from '../../support/localstorage_data.js'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'
import * as safeapps from '../pages/safeapps.pages'
import * as wallet from '../../support/utils/wallet.js'

let staticSafes = []
const walletCredentials = JSON.parse(Cypress.env('CYPRESS_WALLET_CREDENTIALS'))
// DO NOT use OWNER_2_PRIVATE_KEY for safe creation. Used for CF safes.
const signer = walletCredentials.OWNER_2_PRIVATE_KEY

const txOrder = [
  'Activate Safe now',
  'Add another signer',
  'Set up recovery',
  'Swap tokens',
  'Custom transaction',
  'Send token',
]

describe('CF Safe regression tests', () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
  })

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit(constants.homeUrl + staticSafes.SEP_STATIC_SAFE_0)
    main.acceptCookies()
  })

  it('Verify Add native assets and Create tx modals can be opened', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__undeployedSafes, ls.undeployedSafe.safe1)
    cy.reload()
    wallet.connectSigner(signer)
    owner.waitForConnectionStatus()
    createwallet.clickOnAddFundsBtn()
    main.verifyElementsIsVisible([createwallet.qrCode])
    navigation.clickOnModalCloseBtn()

    createwallet.clickOnCreateTxBtn()
    navigation.clickOnModalCloseBtn()
  })

  it('Verify "0 out of 2 step completed" is shown in the dashboard', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__undeployedSafes, ls.undeployedSafe.safe1)
    cy.reload()
    createwallet.checkInitialStepsDisplayed()
  })

  it('Verify "Add native assets" button opens a modal with a QR code and the safe address', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__undeployedSafes, ls.undeployedSafe.safe1)
    cy.reload()
    wallet.connectSigner(signer)
    owner.waitForConnectionStatus()
    createwallet.clickOnAddFundsBtn()
    main.verifyElementsIsVisible([createwallet.qrCode, createwallet.addressInfo])
  })

  it('Verify QR code switch status change works in "Add native assets" modal', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__undeployedSafes, ls.undeployedSafe.safe1)
    cy.reload()
    wallet.connectSigner(signer)
    owner.waitForConnectionStatus()
    createwallet.clickOnAddFundsBtn()
    createwallet.checkQRCodeSwitchStatus(constants.checkboxStates.checked)
    createwallet.clickOnQRCodeSwitch()
    createwallet.checkQRCodeSwitchStatus(constants.checkboxStates.unchecked)
  })

  it('Verify "Create new transaction" modal contains tx types in sequence', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__undeployedSafes, ls.undeployedSafe.safe1)
    cy.reload()
    wallet.connectSigner(signer)
    owner.waitForConnectionStatus()
    createwallet.clickOnCreateTxBtn()
    createwallet.checkAllTxTypesOrder(txOrder)
  })

  it('Verify "Add safe now" button takes to a tx "Activate account"', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__undeployedSafes, ls.undeployedSafe.safe1)
    cy.reload()
    wallet.connectSigner(signer)
    owner.waitForConnectionStatus()
    createwallet.clickOnCreateTxBtn()
    createwallet.clickOnTxType(txOrder[0])
    main.verifyElementsExist([createwallet.activateAccountBtn])
  })

  it('Verify "Add another Owner" takes to a tx Add owner', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__undeployedSafes, ls.undeployedSafe.safe1)
    cy.reload()
    wallet.connectSigner(signer)
    owner.waitForConnectionStatus()
    createwallet.clickOnCreateTxBtn()
    createwallet.clickOnTxType(txOrder[1])
    main.verifyTextVisibility([createwallet.addSignerStr])
  })

  it('Verify "Setup recovery" button takes to the "Account recovery" flow', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__undeployedSafes, ls.undeployedSafe.safe1)
    cy.reload()
    wallet.connectSigner(signer)
    owner.waitForConnectionStatus()
    createwallet.clickOnCreateTxBtn()
    createwallet.clickOnTxType(txOrder[2])
    main.verifyTextVisibility([createwallet.accountRecoveryStr])
  })

  it('Verify "Send token" takes to the tx form to send tokens', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__undeployedSafes, ls.undeployedSafe.safe1)
    cy.reload()
    wallet.connectSigner(signer)
    owner.waitForConnectionStatus()
    createwallet.clickOnCreateTxBtn()
    createwallet.clickOnTxType(txOrder[5])
    main.verifyTextVisibility([createwallet.sendTokensStr])
  })

  it('Verify "Custom transaction" takes to the tx builder app ', () => {
    const iframeSelector = `iframe[id="iframe-${constants.TX_Builder_url}"]`
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__undeployedSafes, ls.undeployedSafe.safe1)
    main.addToLocalStorage(
      constants.localStorageKeys.SAFE_v2__SafeApps__infoModal,
      ls.appPermissions(constants.safeTestAppurl).infoModalAccepted,
    )
    cy.reload()
    wallet.connectSigner(signer)
    owner.waitForConnectionStatus()
    createwallet.clickOnCreateTxBtn()
    createwallet.clickOnTxType(txOrder[4])
    main.getIframeBody(iframeSelector).within(() => {
      cy.contains(safeapps.transactionBuilderStr)
    })
  })

  it('Verify "Notifications" in the settings are disabled', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__undeployedSafes, ls.undeployedSafe.safe1)
    cy.reload()
    cy.visit(constants.notificationsUrl + staticSafes.SEP_STATIC_SAFE_0)
    createwallet.checkNotificationsSwitchIs(constants.enabledStates.disabled)
  })

  it('Verify in assets, that a "Add funds" block is present', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__undeployedSafes, ls.undeployedSafe.safe1)
    cy.reload()
    cy.visit(constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_0)
    main.verifyElementsIsVisible([createwallet.addFundsSection, createwallet.noTokensAlert])
  })

  it('Verify clicking on "Activate now" button opens safe activation flow', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__undeployedSafes, ls.undeployedSafe.safe1)
    cy.reload()
    cy.visit(constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_0)
    createwallet.clickOnActivateAccountBtn()
    main.verifyElementsIsVisible([createwallet.activateAccountBtn])
  })
})
