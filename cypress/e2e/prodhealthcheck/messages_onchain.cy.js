import * as constants from '../../support/constants.js'
import * as main from '../pages/main.page.js'
import * as createTx from '../pages/create_tx.pages.js'
import * as msg_data from '../../fixtures/txmessages_data.json'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'

let staticSafes = []

const typeMessagesOnchain = msg_data.type.onChain

describe('Onchain Messages tests', () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
  })

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit(constants.prodbaseUrl + constants.transactionsHistoryUrl + staticSafes.SEP_STATIC_SAFE_10)
    main.acceptCookies()
  })

  // TODO: Added to prod
  it('Verify summary for signed on-chain message', () => {
    createTx.verifySummaryByName(
      typeMessagesOnchain.contractName,
      [typeMessagesOnchain.success, typeMessagesOnchain.signMessage],
      typeMessagesOnchain.altTmage,
    )
  })
})
