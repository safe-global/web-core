import * as constants from '../../support/constants.js'
import * as main from '../pages/main.page.js'
import * as sideBar from '../pages/sidebar.pages.js'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'
import * as wallet from '../../support/utils/wallet.js'
import * as navigation from '../pages/navigation.page.js'
import * as owner from '../pages/owners.pages.js'

let staticSafes = []
const walletCredentials = JSON.parse(Cypress.env('CYPRESS_WALLET_CREDENTIALS'))
const signer = walletCredentials.OWNER_4_PRIVATE_KEY
const signer1 = walletCredentials.OWNER_1_PRIVATE_KEY
const signer2 = walletCredentials.OWNER_3_PRIVATE_KEY

describe.skip('Sidebar tests 3', () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
  })

  beforeEach(() => {
    cy.clearLocalStorage()
  })

  // TODO: Added to prod
  it('Verify the "My accounts" counter at the top is counting all safes the user owns', () => {
    cy.visit(constants.prodbaseUrl + constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_9)
    main.acceptCookies()
    cy.intercept('GET', constants.safeListEndpoint, {
      11155111: [sideBar.sideBarSafes.safe1, sideBar.sideBarSafes.safe2],
    })
    wallet.connectSigner(signer)
    sideBar.openSidebar()
    sideBar.checkMyAccountCounter(2)
  })

  // TODO: Added to prod
  it('Verify pending signature is displayed in sidebar for unsigned tx', () => {
    cy.visit(constants.prodbaseUrl + constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_7)
    main.acceptCookies()
    wallet.connectSigner(signer)
    cy.intercept('GET', constants.safeListEndpoint, {
      11155111: [sideBar.sideBarSafesPendingActions.safe1],
    })
    sideBar.openSidebar()
    sideBar.verifyTxToConfirmDoesNotExist()

    cy.get('body').click()

    owner.clickOnWalletExpandMoreIcon()
    navigation.clickOnDisconnectBtn()
    cy.intercept('GET', constants.safeListEndpoint, {
      11155111: [sideBar.sideBarSafesPendingActions.safe1],
    })
    wallet.connectSigner(signer2)
    sideBar.openSidebar()
    sideBar.verifyAddedSafesExist([sideBar.sideBarSafesPendingActions.safe1short])
    sideBar.checkTxToConfirm(1)
  })

  // TODO: Added to prod
  it('Verify balance exists in a tx in sidebar', () => {
    cy.visit(constants.prodbaseUrl + constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_7)
    main.acceptCookies()
    wallet.connectSigner(signer)
    owner.clickOnWalletExpandMoreIcon()
    navigation.clickOnDisconnectBtn()
    wallet.connectSigner(signer)
    cy.intercept('GET', constants.safeListEndpoint, {
      11155111: [sideBar.sideBarSafesPendingActions.safe1],
    })
    sideBar.openSidebar()
    sideBar.verifyTxToConfirmDoesNotExist()
    sideBar.checkBalanceExists()
  })
})
