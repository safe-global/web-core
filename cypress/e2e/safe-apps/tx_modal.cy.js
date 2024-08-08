import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as ls from '../../support/localstorage_data.js'

const testAppName = 'Cypress Test App'
const testAppDescr = 'Cypress Test App Description'
const unknownApp = 'unknown'
const confirmTx = 'Confirm transaction'

describe('Transaction modal tests', () => {
  before(async () => {
    cy.clearLocalStorage().then(() => {
      main.addToLocalStorage(constants.localStorageKeys.SAFE_v2_cookies_1_1, ls.cookies.acceptedCookies)
      main.addToLocalStorage(
        constants.localStorageKeys.SAFE_v2__SafeApps__infoModal,
        ls.appPermissions(constants.safeTestAppurl).infoModalAccepted,
      )
    })
  })

  beforeEach(() => {
    cy.fixture('safe-app').then((html) => {
      cy.intercept('GET', `${constants.testAppUrl}/*`, html)
      cy.intercept('GET', `*/manifest.json`, {
        name: testAppName,
        description: testAppDescr,
        icons: [{ src: 'logo.svg', sizes: 'any', type: 'image/svg+xml' }],
      })
    })
  })

  it(
    'Verify that the transaction popup is displayed when sending a transaction from an app',
    { defaultCommandTimeout: 12000 },
    () => {
      cy.visitSafeApp(`${constants.testAppUrl}/dummy`)
      cy.findByRole('dialog').within(() => {
        cy.findByText(confirmTx)
        cy.findByText(unknownApp)
      })
    },
  )
})
