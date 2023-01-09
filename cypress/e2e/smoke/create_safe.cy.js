describe('Create Safe', () => {
  before(() => {
    cy.setLocalStorage('SAFE_v2__lastWallet', JSON.stringify('E2E Wallet'))
  })
  it('should create a new Safe', () => {
    cy.visit('/welcome')

    // Close cookie banner
    cy.contains('button', 'Accept all').click()

    // Ensure wallet is connected to correct chain via header
    cy.contains('E2E Wallet @ Görli')

    cy.contains('Create new Safe').click()

    // Name
    cy.wait(1000) // Wait for form default values to populate
    cy.contains('button', 'Next').click()

    // Owners and confirmations
    cy.wait(1000) // Wait for form default values to populate
    cy.contains('button', 'Next').click()
  })
})
