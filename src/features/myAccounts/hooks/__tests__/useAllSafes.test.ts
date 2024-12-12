import type { UndeployedSafe } from '@/features/counterfactual/store/undeployedSafesSlice'

import * as allOwnedSafes from '@/features/myAccounts/hooks/useAllOwnedSafes'
import useAllSafes from '@/features/myAccounts/hooks/useAllSafes'
import * as useChains from '@/hooks/useChains'
import * as useWallet from '@/hooks/wallets/useWallet'
import { renderHook } from '@/tests/test-utils'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'

describe('useAllSafes hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    jest.spyOn(allOwnedSafes, 'default').mockReturnValue([undefined, undefined, false])
    jest.spyOn(useChains, 'default').mockImplementation(() => ({
      configs: [{ chainId: '1' } as ChainInfo],
    }))
  })

  it('returns an empty array if there is no wallet and allOwned is undefined', () => {
    jest.spyOn(useWallet, 'default').mockReturnValue(null)
    jest.spyOn(allOwnedSafes, 'default').mockReturnValue([undefined, undefined, false])

    const { result } = renderHook(() => useAllSafes())

    expect(result.current).toEqual([])
  })

  it('returns an empty array if the chains config is empty', () => {
    jest.spyOn(useChains, 'default').mockReturnValue({ configs: [] })

    const { result } = renderHook(() => useAllSafes())

    expect(result.current).toEqual([])
  })

  it('returns SafeItems for added safes', () => {
    const { result } = renderHook(() => useAllSafes(), {
      initialReduxState: {
        addedSafes: {
          '1': {
            '0x123': {
              owners: [],
              threshold: 1,
            },
          },
        },
      },
    })

    expect(result.current).toEqual([
      {
        address: '0x123',
        chainId: '1',
        isPinned: true,
        isReadOnly: true,
        lastVisited: 0,
        name: undefined,
      },
    ])
  })

  it('returns SafeItems for owned safes', () => {
    const mockOwnedSafes = {
      '1': ['0x123', '0x456', '0x789'],
    }

    jest.spyOn(allOwnedSafes, 'default').mockReturnValue([mockOwnedSafes, undefined, false])

    const { result } = renderHook(() => useAllSafes())

    expect(result.current).toEqual([
      { address: '0x123', chainId: '1', isPinned: false, isReadOnly: false, lastVisited: 0, name: undefined },
      { address: '0x456', chainId: '1', isPinned: false, isReadOnly: false, lastVisited: 0, name: undefined },
      { address: '0x789', chainId: '1', isPinned: false, isReadOnly: false, lastVisited: 0, name: undefined },
    ])
  })

  it('returns SafeItems for undeployed safes', () => {
    const { result } = renderHook(() => useAllSafes(), {
      initialReduxState: {
        undeployedSafes: {
          '1': {
            '0x123': {
              status: {} as UndeployedSafe['status'],
              props: {} as UndeployedSafe['props'],
            },
          },
        },
      },
    })

    expect(result.current).toEqual([
      {
        address: '0x123',
        chainId: '1',
        isPinned: false,
        isReadOnly: true,
        lastVisited: 0,
        name: undefined,
      },
    ])
  })

  it('returns SafeItems for added safes and owned safes', () => {
    const mockOwnedSafes = {
      '1': ['0x456', '0x789'],
    }
    jest.spyOn(allOwnedSafes, 'default').mockReturnValue([mockOwnedSafes, undefined, false])

    const { result } = renderHook(() => useAllSafes(), {
      initialReduxState: {
        addedSafes: {
          '1': {
            '0x123': {
              owners: [],
              threshold: 1,
            },
          },
        },
      },
    })

    expect(result.current).toEqual([
      { address: '0x123', chainId: '1', isPinned: true, isReadOnly: true, lastVisited: 0, name: undefined },
      { address: '0x456', chainId: '1', isPinned: false, isReadOnly: false, lastVisited: 0, name: undefined },
      { address: '0x789', chainId: '1', isPinned: false, isReadOnly: false, lastVisited: 0, name: undefined },
    ])
  })

  it('returns SafeItems for added safes and undeployed safes', () => {
    const { result } = renderHook(() => useAllSafes(), {
      initialReduxState: {
        addedSafes: {
          '1': {
            '0x123': {
              owners: [],
              threshold: 1,
            },
          },
        },
        undeployedSafes: {
          '1': {
            '0x456': {
              status: {} as UndeployedSafe['status'],
              props: {} as UndeployedSafe['props'],
            },
          },
        },
      },
    })

    expect(result.current).toEqual([
      { address: '0x123', chainId: '1', isPinned: true, isReadOnly: true, lastVisited: 0, name: undefined },
      { address: '0x456', chainId: '1', isPinned: false, isReadOnly: true, lastVisited: 0, name: undefined },
    ])
  })

  it('returns SafeItems for owned safes and undeployed safes', () => {
    const mockOwnedSafes = {
      '1': ['0x456', '0x789'],
    }
    jest.spyOn(allOwnedSafes, 'default').mockReturnValue([mockOwnedSafes, undefined, false])

    const { result } = renderHook(() => useAllSafes(), {
      initialReduxState: {
        undeployedSafes: {
          '1': {
            '0x123': {
              status: {} as UndeployedSafe['status'],
              props: {} as UndeployedSafe['props'],
            },
          },
        },
      },
    })

    expect(result.current).toEqual([
      { address: '0x456', chainId: '1', isPinned: false, isReadOnly: false, lastVisited: 0, name: undefined },
      { address: '0x789', chainId: '1', isPinned: false, isReadOnly: false, lastVisited: 0, name: undefined },
      { address: '0x123', chainId: '1', isPinned: false, isReadOnly: true, lastVisited: 0, name: undefined },
    ])
  })

  it('returns SafeItems for added, owned and undeployed safes', () => {
    const mockOwnedSafes = {
      '1': ['0x456', '0x789'],
    }
    jest.spyOn(allOwnedSafes, 'default').mockReturnValue([mockOwnedSafes, undefined, false])

    const { result } = renderHook(() => useAllSafes(), {
      initialReduxState: {
        addedSafes: {
          '1': {
            '0x123': {
              owners: [],
              threshold: 1,
            },
          },
        },
        undeployedSafes: {
          '1': {
            '0x321': {
              status: {} as UndeployedSafe['status'],
              props: {} as UndeployedSafe['props'],
            },
          },
        },
      },
    })

    expect(result.current).toEqual([
      { address: '0x123', chainId: '1', isPinned: true, isReadOnly: true, lastVisited: 0, name: undefined },
      { address: '0x456', chainId: '1', isPinned: false, isReadOnly: false, lastVisited: 0, name: undefined },
      { address: '0x789', chainId: '1', isPinned: false, isReadOnly: false, lastVisited: 0, name: undefined },
      { address: '0x321', chainId: '1', isPinned: false, isReadOnly: true, lastVisited: 0, name: undefined },
    ])
  })

  describe('buildSafeItem', () => {
    it.todo('returns a pinned SafeItem if its an added safe')
    it.todo('returns a SafeItem with lastVisited of 0 if there is no entry')
    it.todo('returns a readOnly SafeItem if wallet is not owner of added safe')
    it.todo('returns a readOnly SafeItem if it is not an owned safe')
    it.todo('returns a SafeItem with name if it exists in the address book')
  })

  describe('prepareAddresses', () => {
    it.todo('returns added safe addresses')
    it.todo('returns owned safe addresses')
    it.todo('returns undeployed safe addresses')
    it.todo('remove duplicates')
    it.todo('concatenates safe addresses')
  })
})
