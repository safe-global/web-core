import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as createwallet from '../pages/create_wallet.pages'
import * as owner from '../pages/owners.pages'
import * as wallet from '../../support/utils/wallet.js'

const walletCredentials = JSON.parse(Cypress.env('CYPRESS_WALLET_CREDENTIALS'))
// DO NOT use OWNER_2_PRIVATE_KEY for safe creation. Used for CF safes.
const signer = walletCredentials.OWNER_2_PRIVATE_KEY

describe('[SMOKE] CF Safe creation tests', () => {
  beforeEach(() => {
    cy.visit(constants.welcomeUrl + '?chain=sep')
    cy.clearLocalStorage()
    main.acceptCookies()
  })
  it('[SMOKE] CF creation happy path', () => {
    wallet.connectSigner(signer)
    owner.waitForConnectionStatus()
    createwallet.clickOnContinueWithWalletBtn()
    createwallet.clickOnCreateNewSafeBtn()
    createwallet.clickOnNextBtn()
    createwallet.clickOnNextBtn()
    createwallet.selectPayLaterOption()
    createwallet.clickOnReviewStepNextBtn()
    createwallet.verifyCFSafeCreated()
  })
})
