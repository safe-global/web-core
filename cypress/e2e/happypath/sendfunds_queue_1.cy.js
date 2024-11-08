import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as assets from '../pages/assets.pages'
import * as tx from '../pages/transactions.page'
import { ethers } from 'ethers'
import SafeApiKit from '@safe-global/api-kit'
import { createSigners } from '../../support/api/utils_ether'
import { createSafes } from '../../support/api/utils_protocolkit'
import * as wallet from '../../support/utils/wallet.js'
import * as ls from '../../support/localstorage_data.js'
import * as navigation from '../pages/navigation.page.js'
import * as fundSafes from '../../fixtures/safes/funds.json'

const walletCredentials = JSON.parse(Cypress.env('CYPRESS_WALLET_CREDENTIALS'))
const receiver = walletCredentials.OWNER_2_WALLET_ADDRESS
const signer = walletCredentials.OWNER_4_PRIVATE_KEY

const tokenAmount = '0.0001'
const netwrok = 'sepolia'
const network_pref = 'sep:'
const unit_eth = 'ether'
let apiKit, protocolKitOwnerS1, existingSafeAddress1, existingSafeAddress2, existingSafeAddress3

let safes = []
let safesData = []

const provider = new ethers.InfuraProvider(netwrok, Cypress.env('INFURA_API_KEY'))
const privateKeys = [walletCredentials.OWNER_1_PRIVATE_KEY, walletCredentials.OWNER_2_PRIVATE_KEY]

const signers = createSigners(privateKeys, provider)

const owner1Signer = signers[0]

function visit(url) {
  cy.visit(url)
}

function executeTransactionFlow(fromSafe) {
  visit(constants.transactionQueueUrl + fromSafe)
  wallet.connectSigner(signer)
  assets.clickOnConfirmBtn(0)
  tx.executeFlow_1()
  cy.wait(5000)
}

describe('Send funds from queue happy path tests 1', () => {
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

    existingSafeAddress1 = safesData.SEP_FUNDS_SAFE_3.substring(4)
    existingSafeAddress2 = safesData.SEP_FUNDS_SAFE_4.substring(4)
    existingSafeAddress3 = safesData.SEP_FUNDS_SAFE_5.substring(4)

    const safeConfigurations = [
      { signer: privateKeys[0], safeAddress: existingSafeAddress1, provider },
      { signer: privateKeys[0], safeAddress: existingSafeAddress2, provider },
      { signer: privateKeys[0], safeAddress: existingSafeAddress3, provider },
      { signer: privateKeys[1], safeAddress: existingSafeAddress3, provider },
    ]

    safes = await createSafes(safeConfigurations)

    protocolKitOwnerS1 = safes[0]
  })

  it('Verify confirmation and execution of native token queued tx by second signer with connected wallet', () => {
    cy.wrap(null)
      .then(() => {
        return main.fetchCurrentNonce(network_pref + existingSafeAddress1)
      })
      .then(async (currentNonce) => {
        const amount = ethers.parseUnits(tokenAmount, unit_eth).toString()
        const safeTransactionData = {
          to: receiver,
          data: '0x',
          value: amount.toString(),
        }

        const safeTransaction = await protocolKitOwnerS1.createTransaction({ transactions: [safeTransactionData] })
        const safeTxHash = await protocolKitOwnerS1.getTransactionHash(safeTransaction)
        const senderSignature = await protocolKitOwnerS1.signHash(safeTxHash)
        const safeAddress = existingSafeAddress1

        await apiKit.proposeTransaction({
          safeAddress,
          safeTransactionData: safeTransaction.data,
          safeTxHash,
          senderAddress: await owner1Signer.getAddress(),
          senderSignature: senderSignature.data,
        })

        executeTransactionFlow(safeAddress)
        cy.wait(5000)
        main.verifyNonceChange(network_pref + safeAddress, currentNonce + 1)
        navigation.clickOnWalletExpandMoreIcon()
        navigation.clickOnDisconnectBtn()
      })
  })
})
