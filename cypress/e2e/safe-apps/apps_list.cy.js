import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as safeapps from '../pages/safeapps.pages'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'
import * as ls from '../../support/localstorage_data.js'

const myCustomAppTitle = 'Cypress Test App'
const myCustomAppDescrAdded = 'Cypress Test App Description'

let staticSafes = []

describe('Safe Apps list tests', () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
  })

  beforeEach(() => {
    cy.clearLocalStorage().then(() => {
      main.addToLocalStorage(constants.localStorageKeys.SAFE_v2_cookies_1_1, ls.cookies.acceptedCookies)
    })
    cy.visit(`${constants.appsUrl}?safe=${staticSafes.SEP_STATIC_SAFE_1}`, {
      failOnStatusCode: false,
    })
  })

  it('Verify app list can be filtered by app name', () => {
    // Wait for /safe-apps response
    cy.intercept('GET', constants.appsEndpoint).then(() => {
      safeapps.typeAppName(constants.appNames.txbuilder)
      safeapps.verifyLinkName(safeapps.linkNames.txBuilderLogo)
    })
  })

  it('Verify app list can be filtered by app description', () => {
    safeapps.typeAppName(constants.appNames.customContract)
    safeapps.verifyLinkName(safeapps.linkNames.txBuilderLogo)
  })

  it('Verify error message is displayed when no app found', () => {
    safeapps.typeAppName(constants.appNames.noResults)
    safeapps.verifyNoAppsTextPresent()
  })

  it('Verify apps can be pinned', () => {
    safeapps.clearSearchAppInput()
    safeapps.pinApp(safeapps.transactionBuilderStr)
    safeapps.verifyPinnedAppCount(1)
  })

  it('Verify apps can be unpinned', () => {
    safeapps.pinApp(safeapps.transactionBuilderStr)
    safeapps.pinApp(safeapps.transactionBuilderStr, false)
    safeapps.verifyPinnedAppCount(0)
  })

  it('Verify there is an error when the app manifest is invalid', () => {
    cy.intercept('GET', constants.invalidAppUrl, {
      name: constants.testAppData.name,
    })
    safeapps.clickOnCustomAppsTab()
    safeapps.clickOnAddCustomApp()
    safeapps.typeCustomAppUrl(constants.invalidAppUrl)
    safeapps.verifyAppNotSupportedMsg()
  })

  it('Verify an app can be added to the list within the custom apps section', () => {
    cy.intercept('GET', constants.validAppUrlJson, {
      name: constants.testAppData.name,
      description: constants.testAppData.descr,
      icons: [{ src: 'logo.svg', sizes: 'any', type: 'image/svg+xml' }],
    })

    safeapps.clickOnCustomAppsTab()
    safeapps.clickOnAddCustomApp()
    safeapps.typeCustomAppUrl(constants.validAppUrl)
    safeapps.verifyAppTitle(myCustomAppTitle)
    safeapps.acceptTC()
    safeapps.clickOnAddBtn()
    safeapps.verifyCustomAppCount(1)
    safeapps.verifyAppDescription(myCustomAppDescrAdded)
  })
})
