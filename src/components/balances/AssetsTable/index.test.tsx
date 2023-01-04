import * as useChainId from '@/hooks/useChainId'
import { act, fireEvent, getByRole, getByTestId, render, waitFor } from '@/tests/test-utils'
import { safeParseUnits } from '@/utils/formatters'
import { TokenType } from '@safe-global/safe-gateway-typescript-sdk'
import { hexZeroPad } from 'ethers/lib/utils'
import { useState } from 'react'
import AssetsTable from '.'
import { COLLAPSE_TIMEOUT_MS } from './useHideAssets'

const getParentRow = (element: HTMLElement | null) => {
  while (element !== null) {
    if (element.tagName.toLowerCase() === 'tr') {
      return element
    }
    element = element.parentElement
  }
  return null
}

const TestComponent = () => {
  const [showHidden, setShowHidden] = useState(false)
  return (
    <>
      <AssetsTable showHiddenAssets={showHidden} setShowHiddenAssets={setShowHidden} />
      <button data-testid="showHidden" onClick={() => setShowHidden((prev) => !prev)} />
    </>
  )
}

describe('AssetsTable', () => {
  beforeEach(() => {
    window.localStorage.clear()
    jest.clearAllMocks()
    jest.spyOn(useChainId, 'default').mockReturnValue('5')
    jest.useFakeTimers()
  })

  test('select and deselect hidden assets', async () => {
    const mockHiddenAssets = {
      '5': [hexZeroPad('0x2', 20), hexZeroPad('0x3', 20)],
    }
    const mockBalances = {
      data: {
        fiatTotal: '300',
        items: [
          {
            balance: safeParseUnits('100', 18)!.toString(),
            fiatBalance: '100',
            fiatConversion: '1',
            tokenInfo: {
              address: hexZeroPad('0x2', 20),
              decimals: 18,
              logoUri: '',
              name: 'DAI',
              symbol: 'DAI',
              type: TokenType.ERC20,
            },
          },
          {
            balance: safeParseUnits('200', 18)!.toString(),
            fiatBalance: '200',
            fiatConversion: '1',
            tokenInfo: {
              address: hexZeroPad('0x3', 20),
              decimals: 18,
              logoUri: '',
              name: 'SPAM',
              symbol: 'SPM',
              type: TokenType.ERC20,
            },
          },
        ],
      },
      loading: false,
      error: undefined,
    }

    const result = render(<TestComponent />, {
      initialReduxState: {
        balances: mockBalances,
        settings: {
          currency: 'usd',
          hiddenTokens: mockHiddenAssets,
          shortName: {
            show: true,
            copy: true,
            qr: true,
          },
          theme: {
            darkMode: true,
          },
        },
      },
    })

    const toggleHiddenButton = result.getByTestId('showHidden')

    // Show only hidden assets
    fireEvent.click(toggleHiddenButton)

    await waitFor(() => {
      expect(result.queryByText('100 DAI')).not.toBeNull()
      expect(result.queryByText('200 SPM')).not.toBeNull()
    })

    // unhide both tokens
    let tableRow = getParentRow(result.getByText('100 DAI'))
    expect(tableRow).not.toBeNull()
    fireEvent.click(getByRole(tableRow!, 'checkbox'))

    tableRow = getParentRow(result.getByText('200 SPM'))
    expect(tableRow).not.toBeNull()
    fireEvent.click(getByRole(tableRow!, 'checkbox'))

    // hide them again
    tableRow = getParentRow(result.getByText('100 DAI'))
    expect(tableRow).not.toBeNull()
    fireEvent.click(getByRole(tableRow!, 'checkbox'))

    tableRow = getParentRow(result.getByText('200 SPM'))
    expect(tableRow).not.toBeNull()
    fireEvent.click(getByRole(tableRow!, 'checkbox'))

    const saveButton = result.getByText('Save')
    fireEvent.click(saveButton)

    // Both tokens should still be hidden
    expect(result.queryByText('100 DAI')).toBeNull()
    expect(result.queryByText('200 SPM')).toBeNull()
  })

  test('Deselect all and save', async () => {
    const mockHiddenAssets = {
      '5': [hexZeroPad('0x2', 20), hexZeroPad('0x3', 20)],
    }
    const mockBalances = {
      data: {
        fiatTotal: '300',
        items: [
          {
            balance: safeParseUnits('100', 18)!.toString(),
            fiatBalance: '100',
            fiatConversion: '1',
            tokenInfo: {
              address: hexZeroPad('0x2', 20),
              decimals: 18,
              logoUri: '',
              name: 'DAI',
              symbol: 'DAI',
              type: TokenType.ERC20,
            },
          },
          {
            balance: safeParseUnits('200', 18)!.toString(),
            fiatBalance: '200',
            fiatConversion: '1',
            tokenInfo: {
              address: hexZeroPad('0x3', 20),
              decimals: 18,
              logoUri: '',
              name: 'SPAM',
              symbol: 'SPM',
              type: TokenType.ERC20,
            },
          },
        ],
      },
      loading: false,
      error: undefined,
    }

    const result = render(<TestComponent />, {
      initialReduxState: {
        balances: mockBalances,
        settings: {
          currency: 'usd',
          hiddenTokens: mockHiddenAssets,
          shortName: {
            show: true,
            copy: true,
            qr: true,
          },
          theme: {
            darkMode: true,
          },
        },
      },
    })

    const toggleHiddenButton = result.getByTestId('showHidden')

    // Show only hidden assets
    fireEvent.click(toggleHiddenButton)

    await waitFor(() => {
      expect(result.queryByText('100 DAI')).not.toBeNull()
      expect(result.queryByText('200 SPM')).not.toBeNull()
    })

    fireEvent.click(result.getByText('Deselect all'))
    fireEvent.click(result.getByText('Save'))

    await waitFor(() => {
      // Menu should disappear
      expect(result.queryByText('Save')).toBeNull()
      // Assets should still be visible (unhidden)
      expect(result.queryByText('100 DAI')).not.toBeNull()
      expect(result.queryByText('200 SPM')).not.toBeNull()
    })
  })

  test('immediately hide visible assets', async () => {
    const mockHiddenAssets = {
      '5': [],
    }
    const mockBalances = {
      data: {
        fiatTotal: '300',
        items: [
          {
            balance: safeParseUnits('100', 18)!.toString(),
            fiatBalance: '100',
            fiatConversion: '1',
            tokenInfo: {
              address: hexZeroPad('0x2', 20),
              decimals: 18,
              logoUri: '',
              name: 'DAI',
              symbol: 'DAI',
              type: TokenType.ERC20,
            },
          },
          {
            balance: safeParseUnits('200', 18)!.toString(),
            fiatBalance: '200',
            fiatConversion: '1',
            tokenInfo: {
              address: hexZeroPad('0x3', 20),
              decimals: 18,
              logoUri: '',
              name: 'SPAM',
              symbol: 'SPM',
              type: TokenType.ERC20,
            },
          },
        ],
      },
      loading: false,
      error: undefined,
    }

    const result = render(<TestComponent />, {
      initialReduxState: {
        balances: mockBalances,
        settings: {
          currency: 'usd',
          hiddenTokens: mockHiddenAssets,
          shortName: {
            show: true,
            copy: true,
            qr: true,
          },
          theme: {
            darkMode: true,
          },
        },
      },
    })

    // Initially we see all tokens
    expect(result.queryByText('100 DAI')).not.toBeNull()
    expect(result.queryByText('200 SPM')).not.toBeNull()

    // hide one token
    let tableRow = getParentRow(result.getByText('200 SPM'))
    expect(tableRow).not.toBeNull()
    fireEvent.click(getByTestId(tableRow!, 'VisibilityOutlinedIcon'))

    // As the animation runs for 300ms it is still visible in the first 299 ms
    jest.advanceTimersByTime(COLLAPSE_TIMEOUT_MS - 1)
    expect(result.queryByText('200 SPM')).not.toBeNull()

    act(() => jest.advanceTimersByTime(1))
    // We only see DAI
    expect(result.queryByText('100 DAI')).not.toBeNull()
    expect(result.queryByText('200 SPM')).toBeNull()

    // Hide 2nd token
    tableRow = getParentRow(result.getByText('100 DAI'))
    expect(tableRow).not.toBeNull()
    fireEvent.click(getByTestId(tableRow!, 'VisibilityOutlinedIcon'))

    act(() => jest.advanceTimersByTime(COLLAPSE_TIMEOUT_MS))

    expect(result.queryByText('100 DAI')).toBeNull()
    expect(result.queryByText('200 SPM')).toBeNull()
  })

  test('hideAndUnhideAssets', async () => {
    const mockHiddenAssets = {
      '5': [],
    }
    const mockBalances = {
      data: {
        fiatTotal: '300',
        items: [
          {
            balance: safeParseUnits('100', 18)!.toString(),
            fiatBalance: '100',
            fiatConversion: '1',
            tokenInfo: {
              address: hexZeroPad('0x2', 20),
              decimals: 18,
              logoUri: '',
              name: 'DAI',
              symbol: 'DAI',
              type: TokenType.ERC20,
            },
          },
          {
            balance: safeParseUnits('200', 18)!.toString(),
            fiatBalance: '200',
            fiatConversion: '1',
            tokenInfo: {
              address: hexZeroPad('0x3', 20),
              decimals: 18,
              logoUri: '',
              name: 'SPAM',
              symbol: 'SPM',
              type: TokenType.ERC20,
            },
          },
        ],
      },
      loading: false,
      error: undefined,
    }

    const result = render(<TestComponent />, {
      initialReduxState: {
        balances: mockBalances,
        settings: {
          currency: 'usd',
          hiddenTokens: mockHiddenAssets,
          shortName: {
            show: true,
            copy: true,
            qr: true,
          },
          theme: {
            darkMode: true,
          },
        },
      },
    })

    const toggleHiddenButton = result.getByTestId('showHidden')

    // Initially we see all tokens (as none are hidden)
    expect(result.queryByText('100 DAI')).not.toBeNull()
    expect(result.queryByText('200 SPM')).not.toBeNull()

    // toggle spam token
    let tableRow = getParentRow(result.getByText('200 SPM'))
    expect(tableRow).not.toBeNull()

    // hide button
    fireEvent.click(getByTestId(tableRow!, 'VisibilityOutlinedIcon'))

    // SPAM token is hidden now
    await waitFor(() => {
      expect(result.queryByText('100 DAI')).not.toBeNull()
      expect(result.queryByText('200 SPM')).toBeNull()
    })

    // show hidden tokens
    fireEvent.click(toggleHiddenButton)

    // All assets are visible
    await waitFor(() => {
      expect(result.queryByText('100 DAI')).not.toBeNull()
      expect(result.queryByText('200 SPM')).not.toBeNull()
    })

    // Unhide token & reset (make no changes)
    tableRow = getParentRow(result.getByText('200 SPM'))
    expect(tableRow).not.toBeNull()
    fireEvent.click(getByRole(tableRow!, 'checkbox'))
    const resetButton = result.getByText('Cancel')
    fireEvent.click(resetButton)

    // SPAM token is hidden again
    await waitFor(() => {
      expect(result.queryByText('100 DAI')).not.toBeNull()
      expect(result.queryByText('200 SPM')).toBeNull()
    })

    // show hidden tokens
    fireEvent.click(toggleHiddenButton)

    // Unhide token & apply
    tableRow = getParentRow(result.getByText('200 SPM'))
    expect(tableRow).not.toBeNull()
    fireEvent.click(getByRole(tableRow!, 'checkbox'))
    const saveButton = result.getByText('Save')
    fireEvent.click(saveButton)

    // Both tokens are visible again
    await waitFor(() => {
      expect(result.queryByText('100 DAI')).not.toBeNull()
      expect(result.queryByText('200 SPM')).not.toBeNull()
    })
  })
})
