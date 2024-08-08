import * as constants from '../../support/constants.js'
import * as main from './main.page.js'
import * as modal from './modals.page.js'
import * as navigation from './navigation.page.js'
import { safeHeaderInfo } from './import_export.pages.js'
import * as file from './import_export.pages.js'
import safes from '../../fixtures/safes/static.json'

export const chainLogo = '[data-testid="chain-logo"]'
const safeIcon = '[data-testid="safe-icon"]'
const sidebarContainer = '[data-testid="sidebar-container"]'
const openSafesIcon = '[data-testid="open-safes-icon"]'
const qrModalBtn = '[data-testid="qr-modal-btn"]'
const copyAddressBtn = '[data-testid="copy-address-btn"]'
const explorerBtn = '[data-testid="explorer-btn"]'
export const sideBarListItem = '[data-testid="sidebar-list-item"]'
const sideBarListItemWhatsNew = '[data-testid="list-item-whats-new"]'
const sideBarListItemNeedHelp = '[data-testid="list-item-need-help"]'
const sideSafeListItem = '[data-testid="safe-list-item"]'
const sidebarSafeHeader = '[data-testid="safe-header-info"]'
const sidebarSafeContainer = '[data-testid="sidebar-safe-container"]'
const safeItemOptionsBtn = '[data-testid="safe-options-btn"]'
const safeItemOptionsRenameBtn = '[data-testid="rename-btn"]'
const safeItemOptionsRemoveBtn = '[data-testid="remove-btn"]'
const nameInput = '[data-testid="name-input"]'
const saveBtn = '[data-testid="save-btn"]'
const cancelBtn = '[data-testid="cancel-btn"]'
const deleteBtn = '[data-testid="delete-btn"]'
const readOnlyVisibility = '[data-testid="read-only-visibility"]'
const currencySection = '[data-testid="currency-section"]'
const missingSignatureInfo = '[data-testid="missing-signature-info"]'
const queuedTxInfo = '[data-testid="queued-tx-info"]'
const showMoreBtn = '[data-testid="show-more-btn" ]'
const importBtn = '[data-testid="import-btn"]'
export const pendingActivationIcon = '[data-testid="pending-activation-icon"]'
const safeItemMenuIcon = '[data-testid="MoreVertIcon"]'
export const importBtnStr = 'Import'
export const exportBtnStr = 'Export'

export const addedSafesEth = ['0x8675...a19b']
export const addedSafesSepolia = ['0x6d0b...6dC1', '0x5912...fFdb', '0x0637...708e', '0xD157...DE9a']
export const sideBarListItems = ['Home', 'Assets', 'Transactions', 'Address book', 'Apps', 'Settings']
export const sideBarSafes = {
  safe1: '0xBb26E3717172d5000F87DeFd391994f789D80aEB',
  safe2: '0x905934aA8758c06B2422F0C90D97d2fbb6677811',
  safe1short: '0xBb26...0aEB',
  safe2short: '0x9059...7811',
  safe3short: '0x86Cb...2C27',
}
export const sideBarSafesPendingActions = {
  safe1: '0x5912f6616c84024cD1aff0D5b55bb36F5180fFdb',
  safe1short: '0x5912...fFdb',
}
export const testSafeHeaderDetails = ['2/2', safes.SEP_STATIC_SAFE_9_SHORT]
const receiveAssetsStr = 'Receive assets'
const emptyWatchListStr = 'Watch any Safe Account to keep an eye on its activity'
const emptySafeListStr = "You don't have any Safe Accounts yet"
const myAccountsStr = 'My accounts'
const confirmTxStr = (number) => `${number} to confirm`
const pedningTxStr = (n) => `${n} pending transaction`
export const confirmGenStr = 'to confirm'

export function verifyNumberOfPendingTxTag(tx) {
  cy.contains(pedningTxStr(tx))
}

export function getImportBtn() {
  return cy.get(importBtn).scrollIntoView().should('be.visible')
}
export function clickOnSidebarImportBtn() {
  cy.get(sidebarSafeContainer).find(sideSafeListItem).last().scrollIntoView()

  getImportBtn().click()
  modal.verifyModalTitle(modal.modalTitiles.dataImport)
  file.verifyValidImportInputExists()
}

export function showAllSafes() {
  cy.get('body').then(($body) => {
    if ($body.find(showMoreBtn).length > 0) {
      cy.get(showMoreBtn).click()
      cy.wait(500)
      showAllSafes()
    }
  })
}

export function verifyNetworkIsDisplayed(netwrok) {
  cy.get(sidebarContainer)
    .should('be.visible')
    .within(() => {
      cy.get(chainLogo).should('contain', netwrok)
    })
}

export function verifySafeHeaderDetails(details) {
  main.checkTextsExistWithinElement(safeHeaderInfo, details)
  main.verifyElementsExist([safeIcon, currencySection])
}

export function clickOnQRCodeBtn() {
  cy.get(sidebarContainer)
    .should('be.visible')
    .within(() => {
      cy.get(qrModalBtn).click()
    })
}

export function verifyQRModalDisplayed() {
  cy.get(modal.modal).should('be.visible')
  cy.get(modal.modalTitle).should('contain', receiveAssetsStr)
}

export function verifyCopyAddressBtn(data) {
  cy.wait(1000)
  cy.get(sidebarContainer)
    .should('be.visible')
    .within(() => {
      cy.get(copyAddressBtn)
        .click()
        .wait(1000)
        .then(() =>
          cy.window().then((win) => {
            win.navigator.clipboard.readText().then((text) => {
              expect(text).to.contain(data)
            })
          }),
        )
    })
}

export function verifyEtherscanLinkExists() {
  cy.get(sidebarContainer)
    .should('be.visible')
    .within(() => {
      cy.get(explorerBtn).should('have.attr', 'href').and('include', constants.sepoliaEtherscanlLink)
    })
}

export function verifyNewTxBtnStatus(status) {
  main.verifyElementsStatus([navigation.newTxBtn], status)
}

export function verifySideListItems() {
  main.verifyValuesExist(sideBarListItem, sideBarListItems)
  main.verifyElementsExist([sideBarListItemWhatsNew, sideBarListItemNeedHelp])
}

export function verifyTxCounter(counter) {
  cy.get(sideBarListItem).contains(sideBarListItems[2]).should('contain', counter)
}

export function verifySafeCount(count) {
  main.verifyMinimumElementsCount(sideSafeListItem, count)
}

export function openSidebar() {
  cy.get(openSafesIcon).click()
  cy.wait(500)
  showAllSafes()
  main.verifyElementsExist([sidebarSafeContainer])
}

export function verifyAddedSafesExist(safes) {
  main.verifyValuesExist(sideSafeListItem, safes)
}

export function verifyAddedSafesExistByIndex(index, safe) {
  cy.get(sideSafeListItem).eq(index).should('contain', safe)
  cy.get(sideSafeListItem).eq(index).should('contain', 'sep:')
}

export function verifySafesByNetwork(netwrok, safes) {
  cy.get(sidebarSafeContainer).within(() => {
    cy.get(chainLogo)
      .contains(netwrok)
      .parent()
      .next()
      .within(() => {
        main.verifyValuesExist(sideSafeListItem, safes)
      })
  })
}

function getSafeItemByName(name) {
  return cy
    .get(sidebarSafeContainer)
    .find(sideSafeListItem)
    .contains(name)
    .parents('span')
    .parent()
    .within(() => {
      cy.get(safeItemOptionsBtn)
    })
}

export function verifySafeReadOnlyState(safe) {
  getSafeItemByName(safe).find(readOnlyVisibility).should('exist')
}

export function verifyMissingSignature(safe) {
  getSafeItemByName(safe).find(missingSignatureInfo).should('exist')
}

export function verifyQueuedTx(safe) {
  return getSafeItemByName(safe).find(queuedTxInfo).should('exist')
}

function clickOnSafeItemOptionsBtn(name) {
  getSafeItemByName(name).find(safeItemOptionsBtn).click()
}

export function renameSafeItem(oldName, newName) {
  clickOnSafeItemOptionsBtn(oldName)
  clickOnRenameBtn()
  typeSafeName(newName)
}

export function removeSafeItem(name) {
  clickOnSafeItemOptionsBtn(name)
  clickOnRemoveBtn()
  confirmSafeItemRemoval()
  verifyModalRemoved()
}

function typeSafeName(name) {
  cy.get(nameInput).find('input').clear().type(name)
}

function clickOnRenameBtn() {
  cy.get(safeItemOptionsRenameBtn).click()
}

function clickOnRemoveBtn() {
  cy.get(safeItemOptionsRemoveBtn).click()
}

function confirmSafeItemRemoval() {
  cy.get(deleteBtn).click()
}

export function verifySafeNameExists(name) {
  cy.get(sidebarSafeContainer).within(() => {
    cy.get(sideSafeListItem).contains(name)
  })
}

export function verifySafeRemoved(name) {
  main.verifyValuesDoNotExist(sidebarSafeContainer, [name])
}

export function clickOnSaveBtn() {
  cy.get(saveBtn).click()
  verifyModalRemoved()
}

function verifyModalRemoved() {
  main.verifyElementsCount(modal.modalTitle, 0)
}

export function checkCurrencyInHeader(currency) {
  cy.get(sidebarSafeHeader).within(() => {
    cy.get(currencySection).contains(currency)
  })
}

export function checkSafeAddressInHeader(address) {
  main.verifyValuesExist(sidebarSafeHeader, address)
}

export function verifyWatchlistIsEmpty() {
  main.verifyValuesExist(sidebarSafeContainer, [emptyWatchListStr])
}

export function verifySafeListIsEmpty() {
  main.verifyValuesExist(sidebarSafeContainer, [emptySafeListStr])
}

export function verifySafeGiveNameOptionExists(index) {
  cy.get(safeItemMenuIcon).eq(index).click()
  clickOnRenameBtn()
}

export function checkMyAccountCounter(value) {
  cy.contains(myAccountsStr).should('contain', value)
}

export function checkTxToConfirm(numberOfTx) {
  const str = confirmTxStr(numberOfTx)
  main.verifyValuesExist(sideSafeListItem, [str])
}

export function verifyTxToConfirmDoesNotExist() {
  main.verifyValuesDoNotExist(sideSafeListItem, [confirmGenStr])
}

export function checkBalanceExists() {
  const balance = new RegExp(`\\s*\\d*\\.?\\d*\\s*`, 'i')
  const element = cy.get(chainLogo).prev().contains(balance)
}
