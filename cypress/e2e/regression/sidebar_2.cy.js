import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as sideBar from '../pages/sidebar.pages'
import * as ls from '../../support/localstorage_data.js'
import * as assets from '../pages/assets.pages.js'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'

let staticSafes = []

const newSafeName = 'Added safe 3'
const addedSafe900 = 'Added safe 900'
const staticSafe200 = 'Added safe 200'

describe('Sidebar added sidebar tests', () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
  })

  beforeEach(() => {
    cy.visit(constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_9)
    cy.wait(2000)
    cy.clearLocalStorage()
    main.acceptCookies()
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__addedSafes, ls.addedSafes.set2)
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__addressBook, ls.addressBookData.addedSafes)
  })

  it('Verify the safe added are listed in the sidebar', () => {
    sideBar.openSidebar()
    sideBar.verifyAddedSafesExist(sideBar.addedSafesSepolia)
  })

  it('Verify a safe can be renamed', () => {
    sideBar.openSidebar()
    sideBar.renameSafeItem(addedSafe900, newSafeName)
    sideBar.clickOnSaveBtn()
    sideBar.verifySafeNameExists(newSafeName)
  })

  it('Verify a safe can be removed', () => {
    sideBar.openSidebar()
    sideBar.removeSafeItem(addedSafe900)
    sideBar.verifySafeRemoved([addedSafe900])
  })

  it('Verify Fiat currency changes when edited in the assets tab', () => {
    assets.changeCurrency(assets.currencyCAD)
    sideBar.checkCurrencyInHeader(assets.currency$)
  })

  it('Verify "wallet" tag counter if the safe has tx ready for execution', () => {
    sideBar.openSidebar()
    sideBar.verifyNumberOfPendingTxTag(1)
  })
})
