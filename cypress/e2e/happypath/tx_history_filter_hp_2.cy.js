import * as constants from '../../support/constants.js'
import * as main from '../pages/main.page.js'
import * as createTx from '../pages/create_tx.pages.js'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'
import * as ls from '../../support/localstorage_data.js'

let staticSafes = []

describe('Tx history happy path tests 2', () => {
  before(async () => {
    cy.clearLocalStorage().then(() => {
      main.addToLocalStorage(constants.localStorageKeys.SAFE_v2_cookies_1_1, ls.cookies.acceptedCookies)
      main.addToLocalStorage(
        constants.localStorageKeys.SAFE_v2__tokenlist_onboarding,
        ls.cookies.acceptedTokenListOnboarding,
      )
    })
    staticSafes = await getSafes(CATEGORIES.static)
  })

  beforeEach(() => {
    cy.visit(constants.transactionsHistoryUrl + staticSafes.SEP_STATIC_SAFE_8)
  })

  it('Verify a user can filter outgoing transactions by module', () => {
    const moduleAddress = 'sep:0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134'
    const uiDate = 'Jan 30, 2024 - 10:53:48 AM'

    createTx.clickOnFilterBtn()
    createTx.setTxType(createTx.filterTypes.module)
    createTx.fillFilterForm({ address: moduleAddress })
    createTx.clickOnApplyBtn()
    createTx.verifyNumberOfTransactions(1)
    createTx.checkTxItemDate(1, uiDate)
  })
})
