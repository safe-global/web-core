import { renderHook } from '@/tests/test-utils'
import { zeroPadValue, Interface } from 'ethers'
import { type ApprovalInfo, useApprovalInfos } from '@/components/tx/ApprovalEditor/hooks/useApprovalInfos'
import { waitFor } from '@testing-library/react'
import { createMockSafeTransaction } from '@/tests/transactions'
import { OperationType } from '@safe-global/safe-core-sdk-types'
import { ERC20__factory } from '@/types/contracts'
import * as balances from '@/hooks/useBalances'
import { TokenType } from '@safe-global/safe-gateway-typescript-sdk'
import * as getTokenInfo from '@/utils/tokens'
import { PSEUDO_APPROVAL_VALUES } from '../utils/approvals'

const ERC20_INTERFACE = ERC20__factory.createInterface()

const UNLIMITED_APPROVAL = 115792089237316195423570985008687907853269984665640564039457584007913129639935n

const createNonApproveCallData = (to: string, value: string) => {
  return ERC20_INTERFACE.encodeFunctionData('transfer', [to, value])
}

describe('useApprovalInfos', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('returns an empty array if no Safe Transaction exists', async () => {
    const { result } = renderHook(() => useApprovalInfos(undefined))

    expect(result.current).toStrictEqual([[], undefined, true])

    await waitFor(() => {
      expect(result.current).toStrictEqual([[], undefined, false])
    })
  })

  it('returns an empty array if the transaction does not contain any approvals', async () => {
    const mockSafeTx = createMockSafeTransaction({
      to: zeroPadValue('0x0123', 20),
      data: createNonApproveCallData(zeroPadValue('0x02', 20), '20'),
      operation: OperationType.DelegateCall,
    })

    const { result } = renderHook(() => useApprovalInfos(mockSafeTx))

    await waitFor(() => {
      expect(result.current).toStrictEqual([[], undefined, false])
    })
  })

  it('returns an ApprovalInfo if the transaction contains an approval', async () => {
    const testInterface = new Interface(['function approve(address, uint256)'])

    const mockSafeTx = createMockSafeTransaction({
      to: zeroPadValue('0x0123', 20),
      data: testInterface.encodeFunctionData('approve', [zeroPadValue('0x02', 20), '123']),
      operation: OperationType.Call,
    })

    const { result } = renderHook(() => useApprovalInfos(mockSafeTx))

    const mockApproval: ApprovalInfo = {
      amount: BigInt('123'),
      amountFormatted: '0.000000000000000123',
      spender: '0x0000000000000000000000000000000000000002',
      tokenAddress: '0x0000000000000000000000000000000000000123',
      tokenInfo: undefined,
      method: 'approve',
    }

    await waitFor(() => {
      expect(result.current).toEqual([[mockApproval], undefined, false])
    })
  })

  it('returns an ApprovalInfo if the transaction contains an increaseAllowance call', async () => {
    const testInterface = new Interface(['function increaseAllowance(address, uint256)'])

    const mockSafeTx = createMockSafeTransaction({
      to: zeroPadValue('0x0123', 20),
      data: testInterface.encodeFunctionData('increaseAllowance', [zeroPadValue('0x02', 20), '123']),
      operation: OperationType.Call,
    })

    const { result } = renderHook(() => useApprovalInfos(mockSafeTx))

    const mockApproval: ApprovalInfo = {
      amount: BigInt('123'),
      amountFormatted: '0.000000000000000123',
      spender: '0x0000000000000000000000000000000000000002',
      tokenAddress: '0x0000000000000000000000000000000000000123',
      tokenInfo: undefined,
      method: 'increaseAllowance',
    }

    await waitFor(() => {
      expect(result.current).toEqual([[mockApproval], undefined, false])
    })
  })

  it('returns an ApprovalInfo with token infos if the token exists in balances', async () => {
    const mockBalanceItem = {
      balance: '40',
      fiatBalance: '40',
      fiatConversion: '1',
      tokenInfo: {
        address: zeroPadValue('0x0123', 20),
        decimals: 18,
        logoUri: '',
        name: 'Hidden Token',
        symbol: 'HT',
        type: TokenType.ERC20,
      },
    }

    jest
      .spyOn(balances, 'default')
      .mockReturnValue({ balances: { fiatTotal: '0', items: [mockBalanceItem] }, error: undefined, loading: false })
    const testInterface = new Interface(['function approve(address, uint256)'])

    const mockSafeTx = createMockSafeTransaction({
      to: zeroPadValue('0x0123', 20),
      data: testInterface.encodeFunctionData('approve', [zeroPadValue('0x02', 20), '123']),
      operation: OperationType.DelegateCall,
    })

    const { result } = renderHook(() => useApprovalInfos(mockSafeTx))

    const mockApproval: ApprovalInfo = {
      amount: BigInt('123'),
      amountFormatted: '0.000000000000000123',
      spender: '0x0000000000000000000000000000000000000002',
      tokenAddress: '0x0000000000000000000000000000000000000123',
      tokenInfo: mockBalanceItem.tokenInfo,
      method: 'approve',
    }

    await waitFor(() => {
      expect(result.current).toEqual([[mockApproval], undefined, false])
    })
  })

  it('fetches token info for an approval if its missing', async () => {
    const mockTokenInfo = {
      address: '0x0000000000000000000000000000000000000123',
      symbol: 'HT',
      decimals: 18,
      type: TokenType.ERC20,
    }
    const fetchMock = jest
      .spyOn(getTokenInfo, 'getERC20TokenInfoOnChain')
      .mockReturnValue(Promise.resolve(mockTokenInfo))
    const testInterface = new Interface(['function approve(address, uint256)'])

    const mockSafeTx = createMockSafeTransaction({
      to: zeroPadValue('0x0123', 20),
      data: testInterface.encodeFunctionData('approve', [zeroPadValue('0x02', 20), '123']),
      operation: OperationType.DelegateCall,
    })

    const { result } = renderHook(() => useApprovalInfos(mockSafeTx))

    const mockApproval: ApprovalInfo = {
      amount: BigInt('123'),
      amountFormatted: '0.000000000000000123',
      spender: '0x0000000000000000000000000000000000000002',
      tokenAddress: '0x0000000000000000000000000000000000000123',
      tokenInfo: mockTokenInfo,
      method: 'approve',
    }

    await waitFor(() => {
      expect(result.current).toEqual([[mockApproval], undefined, false])
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
  })

  it('detect unlimited approvals and format them as "Unlimited"', async () => {
    const testInterface = new Interface(['function approve(address, uint256)'])

    const mockSafeTx = createMockSafeTransaction({
      to: zeroPadValue('0x0123', 20),
      data: testInterface.encodeFunctionData('approve', [zeroPadValue('0x02', 20), UNLIMITED_APPROVAL]),
      operation: OperationType.Call,
    })

    const { result } = renderHook(() => useApprovalInfos(mockSafeTx))

    const mockApproval: ApprovalInfo = {
      amount: UNLIMITED_APPROVAL,
      amountFormatted: PSEUDO_APPROVAL_VALUES.UNLIMITED,
      spender: '0x0000000000000000000000000000000000000002',
      tokenAddress: '0x0000000000000000000000000000000000000123',
      tokenInfo: undefined,
      method: 'approve',
    }

    await waitFor(() => {
      expect(result.current).toEqual([[mockApproval], undefined, false])
    })
  })
})
