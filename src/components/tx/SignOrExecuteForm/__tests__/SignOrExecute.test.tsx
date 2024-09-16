import SignOrExecute from '../index'
import { render } from '@/tests/test-utils'
import * as hooks from '../hooks'
import type { TransactionDetails } from '@safe-global/safe-gateway-typescript-sdk'
import type { SafeTxContextParams } from '@/components/tx-flow/SafeTxProvider'
import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'
import { createSafeTx } from '@/tests/builders/safeTx'

let isSafeOwner = true
// mock useIsSafeOwner
jest.mock('@/hooks/useIsSafeOwner', () => ({
  __esModule: true,
  default: jest.fn(() => isSafeOwner),
}))

describe('SignOrExecute', () => {
  beforeEach(() => {
    isSafeOwner = true
    jest.clearAllMocks()
  })

  it('should display a loading component', () => {
    const { container } = render(<SignOrExecute onSubmit={jest.fn()} isExecutable={true} />)

    expect(container).toMatchSnapshot()
  })

  it('should display a confirmation screen', async () => {
    jest.spyOn(hooks, 'useProposeTx').mockReturnValue([
      {
        txInfo: {},
      } as TransactionDetails,
      undefined,
      false,
    ])

    const { container, getByTestId } = render(
      <SafeTxContext.Provider
        value={
          {
            safeTx: createSafeTx(),
          } as SafeTxContextParams
        }
      >
        <SignOrExecute onSubmit={jest.fn()} isExecutable={true} />
      </SafeTxContext.Provider>,
    )

    expect(getByTestId('sign-btn')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
