import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as spendinglimit from '../pages/spending_limits.pages'
import * as navigation from '../pages/navigation.page'
import * as tx from '../pages/create_tx.pages'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'
import * as wallet from '../../support/utils/wallet.js'

let staticSafes = []
const walletCredentials = JSON.parse(Cypress.env('CYPRESS_WALLET_CREDENTIALS'))
const signer = walletCredentials.OWNER_4_PRIVATE_KEY
const signerAddress = walletCredentials.OWNER_4_WALLET_ADDRESS

const tokenAmount = 0.1
const newTokenAmount = 0.001
const spendingLimitBalance = '(0.15 ETH)'

describe('Spending limits tests', () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
  })

  beforeEach(() => {
    cy.visit(constants.prodbaseUrl + constants.setupUrl + staticSafes.SEP_STATIC_SAFE_8)
    cy.clearLocalStorage()
    main.acceptCookies()
    cy.get(spendinglimit.spendingLimitsSection).should('be.visible')
  })

  // TODO: Added to prod
  it.skip('Verify that the Review step shows beneficiary, amount allowed, reset time', () => {
    //Assume that default reset time is set to One time
    wallet.connectSigner(signer)
    spendinglimit.clickOnNewSpendingLimitBtn()
    spendinglimit.enterBeneficiaryAddress(staticSafes.SEP_STATIC_SAFE_6)
    spendinglimit.enterSpendingLimitAmount(0.1)
    spendinglimit.clickOnNextBtn()
    spendinglimit.checkReviewData(
      tokenAmount,
      staticSafes.SEP_STATIC_SAFE_6,
      spendinglimit.timePeriodOptions.oneTime.split(' ').join('-'),
    )
  })

  // TODO: Added to prod
  it('Verify values and trash icons are displayed in Beneficiary table', () => {
    spendinglimit.verifyBeneficiaryTable()
  })

  // TODO: Added to prod
  it.skip('Verify Spending limit option is available when selecting the corresponding token', () => {
    wallet.connectSigner(signer)
    navigation.clickOnNewTxBtn()
    tx.clickOnSendTokensBtn()
    spendinglimit.verifyTxOptionExist([spendinglimit.spendingLimitTxOption])
  })
})
