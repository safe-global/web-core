import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as sideBar from '../pages/sidebar.pages'
import * as navigation from '../pages/navigation.page'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'
import * as wallet from '../../support/utils/wallet.js'
import { acceptCookies2 } from '../pages/main.page.js'

let staticSafes = []
const walletCredentials = JSON.parse(Cypress.env('CYPRESS_WALLET_CREDENTIALS'))
const signer = walletCredentials.OWNER_4_PRIVATE_KEY

describe('[PROD] Sidebar tests', () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
  })

  beforeEach(() => {
    cy.visit(constants.prodbaseUrl + constants.homeUrl + staticSafes.SEP_STATIC_SAFE_9)
    acceptCookies2()
  })

  it('Verify current safe details', () => {
    sideBar.verifySafeHeaderDetails(sideBar.testSafeHeaderDetails)
  })

  it('Verify New transaction button enabled for owners', () => {
    wallet.connectSigner(signer)
    sideBar.verifyNewTxBtnStatus(constants.enabledStates.enabled)
  })

  it('Verify New transaction button enabled for beneficiaries who are non-owners', () => {
    cy.visit(constants.prodbaseUrl + constants.homeUrl + staticSafes.SEP_STATIC_SAFE_11)
    wallet.connectSigner(signer)
    sideBar.verifyNewTxBtnStatus(constants.enabledStates.enabled)
  })

  it('Verify New Transaction button disabled for non-owners', () => {
    main.verifyElementsCount(navigation.newTxBtn, 0)
  })
})