import React from 'react'
import { render, screen } from '@/src/tests/test-utils'
import { NoFunds } from './NoFunds'

describe('NoFunds', () => {
  it('renders the empty token component', () => {
    render(<NoFunds />)

    // Check for the main elements
    expect(screen.getByText('Add funds to get started')).toBeTruthy()
    expect(
      screen.getByText('Send funds to your Safe Account from another wallet by copying your address.'),
    ).toBeTruthy()
  })

  it('renders the EmptyToken component', () => {
    render(<NoFunds />)

    // Check if EmptyToken is rendered by looking for its container
    expect(screen.getByTestId('empty-token')).toBeTruthy()
  })
})
