import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as safeapps from '../pages/safeapps.pages'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'
import * as ls from '../../support/localstorage_data.js'

let staticSafes = []

describe('Preview drawer tests', () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
    cy.clearLocalStorage().then(() => {
      main.addToLocalStorage(constants.localStorageKeys.SAFE_v2_cookies_1_1, ls.cookies.acceptedCookies)
    })
  })

  beforeEach(() => {
    cy.visit(`${constants.appsUrl}?safe=${staticSafes.SEP_STATIC_SAFE_2}`, {
      failOnStatusCode: false,
    })
  })

  it('Verify the preview drawer is displayed when opening a Safe App from the app list', () => {
    safeapps.clickOnApp(safeapps.transactionBuilderStr)

    cy.findByRole('presentation').within(() => {
      safeapps.verifyPreviewWindow(
        safeapps.transactiobUilderHeadlinePreview,
        safeapps.connecttextPreview,
        safeapps.availableNetworksPreview,
      )
      safeapps.closePreviewWindow()
    })
    cy.findByRole('presentation').should('not.exist')
  })
})
