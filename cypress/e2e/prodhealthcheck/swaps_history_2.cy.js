import * as constants from '../../support/constants.js'
import * as main from '../pages/main.page.js'
import * as create_tx from '../pages/create_tx.pages.js'
import * as swaps_data from '../../fixtures/swaps_data.json'
import * as swaps from '../pages/swaps.pages.js'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'

let staticSafes = []

const swapsHistory = swaps_data.type.history

describe('Swaps history tests 2', () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
  })

  beforeEach(() => {
    cy.clearLocalStorage()
  })

  // TODO: Added to prod
  it('Verify swap buy operation with 2 actions: approve & swap', { defaultCommandTimeout: 30000 }, () => {
    cy.visit(
      constants.prodbaseUrl + constants.transactionUrl + staticSafes.SEP_STATIC_SAFE_1 + swaps.swapTxs.buy2actions,
    )
    main.acceptCookies()

    const eq = swaps.createRegex(swapsHistory.oneGNOFull, 'COW')
    const atMost = swaps.createRegex(swapsHistory.forAtMostCow, 'COW')

    create_tx.verifyExpandedDetails([
      swapsHistory.buyOrder,
      swapsHistory.buy,
      eq,
      atMost,
      swapsHistory.cow,
      swapsHistory.expired,
      swapsHistory.actionApprove,
      swapsHistory.actionPreSignature,
    ])
  })

  // TODO: Added to prod
  // TODO: Unskip after next release due to changes in design tx
  it.skip(
    'Verify no decoding if tx was created using CowSwap safe-app in the history',
    { defaultCommandTimeout: 30000 },
    () => {
      cy.visit(
        constants.prodbaseUrl +
          constants.transactionUrl +
          staticSafes.SEP_STATIC_SAFE_1 +
          swaps.swapTxs.safeAppSwapOrder,
      )
      main.acceptCookies()
      main.verifyValuesDoNotExist('div', [
        swapsHistory.actionApproveG,
        swapsHistory.actionDepositG,
        swapsHistory.amount,
        swapsHistory.executionPrice,
        swapsHistory.surplus,
        swapsHistory.expiry,
        swapsHistory.oderId,
        swapsHistory.status,
        swapsHistory.forAtLeast,
        swapsHistory.forAtMost,
      ])
      main.verifyValuesDoNotExist(create_tx.transactionItem, [swapsHistory.title, swapsHistory.cow, swapsHistory.dai])
      main.verifyValuesExist(create_tx.transactionItem, [swapsHistory.actionPreSignatureG, swapsHistory.safeAppTitile])
    },
  )
})
