import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as navigation from '../pages/navigation.page'
import * as tx from '../pages/transactions.page'
import * as nfts from '../pages/nfts.pages'
import * as ls from '../../support/localstorage_data.js'
import { ethers } from 'ethers'
import SafeApiKit from '@safe-global/api-kit'
import { createSigners } from '../../support/api/utils_ether'
import { createSafes } from '../../support/api/utils_protocolkit'
import { contracts, abi_qtrust, abi_nft_pc2 } from '../../support/api/contracts'
import * as wallet from '../../support/utils/wallet.js'
import * as fundSafes from '../../fixtures/safes/funds.json'

const transferAmount = '1'

const walletCredentials = JSON.parse(Cypress.env('CYPRESS_WALLET_CREDENTIALS'))
const signer = walletCredentials.OWNER_4_PRIVATE_KEY

const netwrok = 'sepolia'
const network_pref = 'sep:'

let apiKit, protocolKitOwner1_S3, protocolKitOwner2_S3, outgoingSafeAddress

let safes = []
let safesData = []

const provider = new ethers.InfuraProvider(netwrok, Cypress.env('INFURA_API_KEY'))
const privateKeys = [walletCredentials.OWNER_1_PRIVATE_KEY, walletCredentials.OWNER_2_PRIVATE_KEY]
const walletAddress = [walletCredentials.OWNER_1_WALLET_ADDRESS]
const signers = createSigners(privateKeys, provider)
const nftContractAddress = contracts.nft_pc2
const nftContract = new ethers.Contract(nftContractAddress, abi_nft_pc2, provider)

const owner1Signer = signers[0]

describe('Send funds with connected signer happy path tests', { defaultCommandTimeout: 60000 }, () => {
  before(async () => {
    cy.clearLocalStorage().then(() => {
      main.addToLocalStorage(constants.localStorageKeys.SAFE_v2_cookies, ls.cookies.acceptedCookies)
      main.addToLocalStorage(
        constants.localStorageKeys.SAFE_v2__tokenlist_onboarding,
        ls.cookies.acceptedTokenListOnboarding,
      )
    })
    safesData = fundSafes
    apiKit = new SafeApiKit({
      chainId: BigInt(1),
      txServiceUrl: constants.stagingTxServiceUrl,
    })

    outgoingSafeAddress = safesData.SEP_FUNDS_SAFE_6.substring(4)

    const safeConfigurations = [
      { signer: walletCredentials.OWNER_1_PRIVATE_KEY, safeAddress: outgoingSafeAddress, provider },
      { signer: walletCredentials.OWNER_2_PRIVATE_KEY, safeAddress: outgoingSafeAddress, provider },
    ]

    safes = await createSafes(safeConfigurations)

    protocolKitOwner1_S3 = safes[0]
    protocolKitOwner2_S3 = safes[1]
  })

  it('Verify tx creation and execution of NFT with connected signer', () => {
    cy.wait(2000)
    const originatingSafe = safesData.SEP_FUNDS_SAFE_7.substring(4)

    function executeTransactionFlow(fromSafe, toSafe) {
      return cy.visit(constants.balanceNftsUrl + fromSafe).then(() => {
        wallet.connectSigner(signer)
        nfts.selectNFTs(1)
        nfts.sendNFT()
        nfts.typeRecipientAddress(toSafe)
        nfts.clikOnNextBtn()
        tx.executeFlow_1()
        cy.wait(5000)
      })
    }

    cy.wrap(null)
      .then(() => {
        return main.fetchCurrentNonce(network_pref + originatingSafe)
      })
      .then(async (currentNonce) => {
        executeTransactionFlow(originatingSafe, walletAddress.toString(), transferAmount).then(async () => {
          main.checkTokenBalanceIsNull(network_pref + originatingSafe, constants.tokenAbbreviation.tpcc)
          const contractWithWallet = nftContract.connect(owner1Signer)
          const tx = await contractWithWallet.safeTransferFrom(walletAddress.toString(), originatingSafe, 1, {
            gasLimit: 200000,
          })
          await tx.wait()
          main.verifyNonceChange(network_pref + originatingSafe, currentNonce + 1)
          navigation.clickOnWalletExpandMoreIcon()
          navigation.clickOnDisconnectBtn()
        })
      })
  })
})
