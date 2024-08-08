import * as constants from '../../support/constants.js'
import * as main from '../pages/main.page.js'
import * as sideBar from '../pages/sidebar.pages.js'
import * as ls from '../../support/localstorage_data.js'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'
import * as wallet from '../../support/utils/wallet.js'
import * as create_wallet from '../pages/create_wallet.pages.js'
import * as navigation from '../pages/navigation.page.js'
import * as owner from '../pages/owners.pages.js'

let staticSafes = []
const walletCredentials = JSON.parse(Cypress.env('CYPRESS_WALLET_CREDENTIALS'))
const signer = walletCredentials.OWNER_4_PRIVATE_KEY
const signer1 = walletCredentials.OWNER_1_PRIVATE_KEY
const signer2 = walletCredentials.OWNER_3_PRIVATE_KEY

describe('Sidebar tests 3', () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
  })

  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('Verify that users with no accounts see the empty state in "My accounts" block', () => {
    cy.visit(constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_9)
    main.acceptCookies()
    cy.intercept('GET', constants.safeListEndpoint, { 1: [], 100: [], 137: [], 11155111: [] })
    wallet.connectSigner(signer)
    sideBar.openSidebar()
    sideBar.verifySafeListIsEmpty()
  })

  it('Verify empty state of the Watchlist', () => {
    cy.visit(constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_9)
    main.acceptCookies()
    cy.intercept('GET', constants.safeListEndpoint, {})
    wallet.connectSigner(signer)
    sideBar.openSidebar()
    sideBar.verifyWatchlistIsEmpty()
  })

  it('Verify connected user is redirected from welcome page to accounts page', () => {
    cy.visit(constants.welcomeUrl + '?chain=sep')
    main.acceptCookies()
    wallet.connectSigner(signer)
    create_wallet.clickOnContinueWithWalletBtn()

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/welcome/accounts')
    })
  })

  it('Verify that the user see safes that he owns in the list', () => {
    cy.visit(constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_9)
    main.acceptCookies()
    cy.intercept('GET', constants.safeListEndpoint, {
      11155111: [sideBar.sideBarSafes.safe1, sideBar.sideBarSafes.safe2],
    })

    wallet.connectSigner(signer)
    sideBar.openSidebar()
    sideBar.verifyAddedSafesExistByIndex(0, sideBar.sideBarSafes.safe1short)
    sideBar.verifyAddedSafesExistByIndex(1, sideBar.sideBarSafes.safe2short)
  })

  it('Verify there is an option to name an unnamed safe', () => {
    cy.visit(constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_9)
    main.acceptCookies()
    cy.intercept('GET', constants.safeListEndpoint, {
      11155111: [sideBar.sideBarSafes.safe1, sideBar.sideBarSafes.safe2],
    })
    wallet.connectSigner(signer)
    sideBar.openSidebar()
    sideBar.verifySafeGiveNameOptionExists(0)
  })

  it('Verify Import/export buttons are present', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__addressBook, ls.addressBookData.addedSafes)
    cy.visit(constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_9)
    main.acceptCookies()
    cy.intercept('GET', constants.safeListEndpoint, {
      11155111: [sideBar.sideBarSafes.safe1, sideBar.sideBarSafes.safe2],
    })
    wallet.connectSigner(signer)
    sideBar.openSidebar()
    main.checkButtonByTextExists(sideBar.importBtnStr)
    main.checkButtonByTextExists(sideBar.exportBtnStr)
  })

  // TODO: Added to prod
  it('Verify the "My accounts" counter at the top is counting all safes the user owns', () => {
    cy.visit(constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_9)
    main.acceptCookies()
    cy.intercept('GET', constants.safeListEndpoint, {
      11155111: [sideBar.sideBarSafes.safe1, sideBar.sideBarSafes.safe2],
    })
    wallet.connectSigner(signer)
    sideBar.openSidebar()
    sideBar.checkMyAccountCounter(2)
  })

  it('Verify that safes the user do not owns show in the watchlist after adding them', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__addedSafes, ls.addedSafes.set4)
    cy.visit(constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_9)
    main.acceptCookies()
    wallet.connectSigner(signer1)
    sideBar.openSidebar()
    sideBar.verifyAddedSafesExist([sideBar.sideBarSafes.safe3short])
  })

  it('Verify that safes that the user owns do show in the watchlist after adding them', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__addedSafes, ls.addedSafes.set4)
    cy.visit(constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_9)
    main.acceptCookies()
    wallet.connectSigner(signer1)
    sideBar.openSidebar()
    sideBar.verifyAddedSafesExist([sideBar.sideBarSafes.safe3short])
  })

  // TODO: Added to prod
  it('Verify pending signature is displayed in sidebar for unsigned tx', () => {
    cy.visit(constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_7)
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
    cy.visit(constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_7)
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
