import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as nfts from '../pages/nfts.pages'
import * as createTx from '../pages/create_tx.pages'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'
import * as wallet from '../../support/utils/wallet.js'

const singleNFT = ['safeTransferFrom']
const multipleNFT = ['multiSend']
const multipleNFTAction = 'safeTransferFrom'
const NFTSentName = 'GTT #22'

let nftsSafes,
  staticSafes = []

const walletCredentials = JSON.parse(Cypress.env('CYPRESS_WALLET_CREDENTIALS'))
const signer = walletCredentials.OWNER_4_PRIVATE_KEY

describe.skip('NFTs tests', () => {
  before(() => {
    getSafes(CATEGORIES.nfts)
      .then((nfts) => {
        nftsSafes = nfts
        return getSafes(CATEGORIES.static)
      })
      .then((statics) => {
        staticSafes = statics
      })
  })

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit(constants.prodbaseUrl + constants.balanceNftsUrl + staticSafes.SEP_STATIC_SAFE_2)
    main.acceptCookies()
    wallet.connectSigner(signer)
    nfts.waitForNftItems(2)
  })

  // TODO: Added to prod
  // TODO: Add Sign action
  it('Verify multipls NFTs can be selected and reviewed', () => {
    nfts.verifyInitialNFTData()
    nfts.selectNFTs(3)
    nfts.deselectNFTs([2], 3)
    nfts.sendNFT()
    nfts.verifyNFTModalData()
    nfts.typeRecipientAddress(staticSafes.SEP_STATIC_SAFE_1)
    nfts.clikOnNextBtn()
    nfts.verifyReviewModalData(2)
  })

  // TODO: Added to prod
  it('Verify that when 2 NFTs are selected, actions and tx details are correct in Review step', () => {
    nfts.verifyInitialNFTData()
    nfts.selectNFTs(2)
    nfts.sendNFT()
    nfts.typeRecipientAddress(staticSafes.SEP_STATIC_SAFE_1)
    nfts.clikOnNextBtn()
    nfts.verifyTxDetails(multipleNFT)
    nfts.verifyCountOfActions(2)
    nfts.verifyActionName(0, multipleNFTAction)
    nfts.verifyActionName(1, multipleNFTAction)
  })

  // TODO: Added to prod
  it('Verify Send button is disabled for non-owner', () => {
    cy.visit(constants.balanceNftsUrl + nftsSafes.SEP_NFT_SAFE_2)
    nfts.verifyInitialNFTData()
    nfts.selectNFTs(1)
    nfts.verifySendNFTBtnDisabled()
  })

  // TODO: Added to prod
  it('Verify Send NFT transaction has been created', () => {
    cy.visit(constants.balanceNftsUrl + nftsSafes.SEP_NFT_SAFE_1)
    nfts.verifyInitialNFTData()
    nfts.selectNFTs(1)
    nfts.sendNFT()
    nfts.typeRecipientAddress(staticSafes.SEP_STATIC_SAFE_1)
    createTx.changeNonce(2)
    nfts.clikOnNextBtn()
    createTx.clickOnSignTransactionBtn()
    createTx.waitForProposeRequest()
    createTx.clickViewTransaction()
    createTx.verifySingleTxPage()
    createTx.verifyQueueLabel()
    createTx.verifyTransactionStrExists(NFTSentName)
  })
})
