import * as constants from '../../support/constants'
import * as main from '../../e2e/pages/main.page'
import * as owner from '../pages/owners.pages'
import * as createTx from '../pages/create_tx.pages.js'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'
import * as wallet from '../../support/utils/wallet.js'
import * as ls from '../../support/localstorage_data.js'

let staticSafes = []
const walletCredentials = JSON.parse(Cypress.env('CYPRESS_WALLET_CREDENTIALS'))
const signer = walletCredentials.OWNER_4_PRIVATE_KEY

const ownerName = 'Replacement Signer Name'

describe('Replace Owners tests', () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
  })

  beforeEach(() => {
    cy.visit(constants.setupUrl + staticSafes.SEP_STATIC_SAFE_4)
    cy.clearLocalStorage()
    main.acceptCookies()
    cy.contains(owner.safeAccountNonceStr, { timeout: 10000 })
  })

  it('Verify Tooltip displays correct message for disconnected user', () => {
    owner.verifyReplaceBtnIsDisabled()
  })

  // TODO: Check unit tests
  it('Verify max characters in name field', () => {
    wallet.connectSigner(signer)
    owner.waitForConnectionStatus()
    owner.openReplaceOwnerWindow()
    owner.typeOwnerName(main.generateRandomString(51))
    owner.verifyErrorMsgInvalidAddress(constants.addressBookErrrMsg.exceedChars)
  })

  it('Verify that Address input auto-fills with related value', () => {
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__addressBook, ls.addressBookData.autofillData)
    cy.visit(constants.setupUrl + staticSafes.SEP_STATIC_SAFE_4)
    wallet.connectSigner(signer)
    owner.waitForConnectionStatus()
    owner.openReplaceOwnerWindow()
    owner.typeOwnerAddress(constants.addresBookContacts.user1.address)
    owner.verifyNewOwnerName(constants.addresBookContacts.user1.name)
  })

  it('Verify that Name field not mandatory. Verify confirmation for owner replacement is displayed', () => {
    wallet.connectSigner(signer)
    owner.waitForConnectionStatus()
    owner.openReplaceOwnerWindow()
    owner.typeOwnerAddress(constants.SEPOLIA_OWNER_2)
    owner.clickOnNextBtn()
    owner.verifyConfirmTransactionWindowDisplayed()
  })

  it('Verify relevant error messages are displayed in Address input', () => {
    wallet.connectSigner(signer)
    owner.waitForConnectionStatus()
    owner.openReplaceOwnerWindow()
    owner.typeOwnerAddress(main.generateRandomString(10))
    owner.verifyErrorMsgInvalidAddress(constants.addressBookErrrMsg.invalidFormat)

    owner.typeOwnerAddress(constants.addresBookContacts.user1.address.toUpperCase())
    owner.verifyErrorMsgInvalidAddress(constants.addressBookErrrMsg.invalidChecksum)

    owner.typeOwnerAddress(staticSafes.SEP_STATIC_SAFE_4)
    owner.verifyErrorMsgInvalidAddress(constants.addressBookErrrMsg.ownSafe)

    owner.typeOwnerAddress(constants.addresBookContacts.user1.address.replace('F', 'f'))
    owner.verifyErrorMsgInvalidAddress(constants.addressBookErrrMsg.invalidChecksum)

    owner.typeOwnerAddress(constants.DEFAULT_OWNER_ADDRESS)
    owner.verifyErrorMsgInvalidAddress(constants.addressBookErrrMsg.alreadyAdded)
  })

  // TODO: Flaky. Fix ProposeTx request
  it.skip("Verify 'Replace' tx is created", () => {
    cy.visit(constants.setupUrl + staticSafes.SEP_STATIC_SAFE_4)
    wallet.connectSigner(signer)
    owner.waitForConnectionStatus()
    owner.openReplaceOwnerWindow()
    cy.wait(1000)
    owner.typeOwnerName(ownerName)
    owner.typeOwnerAddress(constants.SEPOLIA_OWNER_2)
    createTx.changeNonce(2)
    owner.clickOnNextBtn()
    createTx.clickOnSignTransactionBtn()
    createTx.waitForProposeRequest()
    createTx.clickViewTransaction()
    createTx.verifyReplacedSigner(ownerName)
  })
})
