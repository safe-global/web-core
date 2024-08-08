import * as constants from '../../support/constants'
import * as dashboard from '../pages/dashboard.pages'
import * as main from '../pages/main.page'
import * as safeapps from '../pages/safeapps.pages'
import * as createTx from '../pages/create_tx.pages'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'

let staticSafes = []

const txData = ['14', 'Send', '-0.00002 ETH', '1 out of 1']
const txaddOwner = ['5', 'addOwnerWithThreshold', '1 out of 2']
const txMultiSendCall3 = ['4', 'Batch', '3 actions', '1 out of 2']
const txMultiSendCall2 = ['6', 'Batch', '2 actions', '1 out of 2']

describe('[SMOKE] Dashboard tests', { defaultCommandTimeout: 20000 }, () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
  })

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit(constants.homeUrl + staticSafes.SEP_STATIC_SAFE_2)
    main.acceptCookies()
    dashboard.verifyConnectTransactStrIsVisible()
  })

  it('[SMOKE] Verify the overview widget is displayed', () => {
    dashboard.verifyOverviewWidgetData()
  })

  it('[SMOKE] Verify the transaction queue widget is displayed', () => {
    dashboard.verifyTxQueueWidget()
  })

  it('[SMOKE] Verify the featured Safe Apps are displayed', () => {
    dashboard.verifyFeaturedAppsSection()
  })

  it('[SMOKE] Verify the Safe Apps Section is displayed', () => {
    dashboard.verifySafeAppsSection()
  })

  it('[SMOKE] Verify clicking on Explore Safe apps button opens list of all apps', () => {
    dashboard.clickOnExploreAppsBtn()
  })

  it('[SMOKE] Verify that pinned in dashboard, an app keeps its status on apps page', () => {
    dashboard.pinAppByIndex(0).then((pinnedApp) => {
      cy.visit(constants.appsUrlGeneral + staticSafes.SEP_STATIC_SAFE_2)
      safeapps.verifyPinnedApp(pinnedApp)
      cy.visit(constants.homeUrl + staticSafes.SEP_STATIC_SAFE_2)
      dashboard.clickOnPinBtnByName(pinnedApp)
      dashboard.verifyPinnedAppsCount(0)
    })
  })

  it('[SMOKE] Verify clicking on View All button directs to list of all queued txs', () => {
    dashboard.clickOnViewAllBtn()
    createTx.verifyNumberOfTransactions(2)
  })

  it('[SMOKE] Verify there is empty tx string and image when there are no tx queued', () => {
    cy.visit(constants.homeUrl + staticSafes.SEP_STATIC_SAFE_13)
    dashboard.verifyEmptyTxSection()
  })

  it('[SMOKE] Verify that the last created tx in conflicting tx is showed in the widget', () => {
    dashboard.verifyDataInPendingTx(txData)
  })

  it('[SMOKE] Verify that tx are displayed correctly in Pending tx section', () => {
    cy.visit(constants.homeUrl + staticSafes.SEP_STATIC_SAFE_12)
    cy.wait(1000)
    dashboard.verifyTxItemInPendingTx(txMultiSendCall3)
    dashboard.verifyTxItemInPendingTx(txaddOwner)
    dashboard.verifyTxItemInPendingTx(txMultiSendCall2)
  })

  it('[SMOKE] Verify clicking on any tx takes the user to Transactions > Queue tab', () => {
    dashboard.clickOnTxByIndex(0)
    dashboard.verifySingleTxItem(txData)
  })
})
