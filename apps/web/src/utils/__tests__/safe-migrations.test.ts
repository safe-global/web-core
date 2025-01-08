import {
  type ChainInfo,
  ImplementationVersionState,
  type TransactionData,
} from '@safe-global/safe-gateway-typescript-sdk'
import { OperationType } from '@safe-global/safe-core-sdk-types'
import { prependSafeToL2Migration } from '../safe-migrations'
import { extractMigrationL2MasterCopyAddress } from '@/features/multichain/utils/extract-migration-data'
import { extendedSafeInfoBuilder } from '@/tests/builders/safe'
import { chainBuilder } from '@/tests/builders/chains'
import { safeSignatureBuilder, safeTxBuilder, safeTxDataBuilder } from '@/tests/builders/safeTx'
import {
  getMultiSendCallOnlyDeployment,
  getMultiSendDeployment,
  getSafeL2SingletonDeployment,
  getSafeSingletonDeployment,
  getSafeToL2MigrationDeployment,
} from '@safe-global/safe-deployments'
import type Safe from '@safe-global/protocol-kit'
import { encodeMultiSendData } from '@safe-global/protocol-kit'
import { Multi_send__factory, Safe_to_l2_migration__factory } from '@/types/contracts'
import { faker } from '@faker-js/faker'
import { getAndValidateSafeSDK } from '@/services/tx/tx-sender/sdk'
import { decodeMultiSendData } from '@safe-global/protocol-kit/dist/src/utils'
import { checksumAddress } from '../addresses'
import { createUpdateMigration } from '../safe-migrations'

jest.mock('@/services/tx/tx-sender/sdk')

const safeToL2MigrationDeployment = getSafeToL2MigrationDeployment()
const safeToL2MigrationAddress = safeToL2MigrationDeployment?.defaultAddress
const safeToL2MigrationInterface = Safe_to_l2_migration__factory.createInterface()
const multisendInterface = Multi_send__factory.createInterface()

describe('prependSafeToL2Migration', () => {
  const mockGetAndValidateSdk = getAndValidateSafeSDK as jest.MockedFunction<typeof getAndValidateSafeSDK>

  beforeEach(() => {
    // Mock create Tx
    mockGetAndValidateSdk.mockReturnValue({
      createTransaction: ({ transactions, onlyCalls }) => {
        return Promise.resolve(
          safeTxBuilder()
            .with({
              data: safeTxDataBuilder()
                .with({
                  to: onlyCalls
                    ? (getMultiSendCallOnlyDeployment()?.defaultAddress ?? faker.finance.ethereumAddress())
                    : (getMultiSendDeployment()?.defaultAddress ?? faker.finance.ethereumAddress()),
                  value: '0',
                  data: Multi_send__factory.createInterface().encodeFunctionData('multiSend', [
                    encodeMultiSendData(transactions),
                  ]),
                  nonce: 0,
                  operation: 1,
                })
                .build(),
            })
            .build(),
        )
      },
    } as Safe)
  })

  it('should return undefined for undefined safeTx', () => {
    expect(
      prependSafeToL2Migration(undefined, extendedSafeInfoBuilder().build(), chainBuilder().build()),
    ).resolves.toBeUndefined()
  })

  it('should throw if chain is undefined', () => {
    expect(() => prependSafeToL2Migration(undefined, extendedSafeInfoBuilder().build(), undefined)).toThrowError()
  })

  it('should not modify tx if the chain is L1', () => {
    const safeTx = safeTxBuilder()
      .with({ data: safeTxDataBuilder().with({ nonce: 0 }).build() })
      .build()

    const safeInfo = extendedSafeInfoBuilder()
      .with({ implementationVersionState: ImplementationVersionState.UNKNOWN })
      .build()

    expect(prependSafeToL2Migration(safeTx, safeInfo, chainBuilder().with({ l2: false }).build())).resolves.toEqual(
      safeTx,
    )
  })

  it('should not modify tx if the nonce is > 0', () => {
    const safeTx = safeTxBuilder()
      .with({ data: safeTxDataBuilder().with({ nonce: 1 }).build() })
      .build()

    const safeInfo = extendedSafeInfoBuilder()
      .with({ implementationVersionState: ImplementationVersionState.UNKNOWN })
      .build()

    expect(prependSafeToL2Migration(safeTx, safeInfo, chainBuilder().with({ l2: true }).build())).resolves.toEqual(
      safeTx,
    )
  })

  it('should not modify tx if implementationState is correct', () => {
    const safeTx = safeTxBuilder()
      .with({ data: safeTxDataBuilder().with({ nonce: 0 }).build() })
      .build()

    const safeInfo = extendedSafeInfoBuilder()
      .with({ implementationVersionState: ImplementationVersionState.UP_TO_DATE })
      .build()
    expect(prependSafeToL2Migration(safeTx, safeInfo, chainBuilder().with({ l2: true }).build())).resolves.toEqual(
      safeTx,
    )
  })

  it('should not modify tx if the tx is already signed', () => {
    const safeTx = safeTxBuilder()
      .with({ data: safeTxDataBuilder().with({ nonce: 0 }).build() })
      .build()

    safeTx.addSignature(safeSignatureBuilder().build())

    const safeInfo = extendedSafeInfoBuilder()
      .with({ implementationVersionState: ImplementationVersionState.UNKNOWN })
      .build()

    expect(prependSafeToL2Migration(safeTx, safeInfo, chainBuilder().with({ l2: true }).build())).resolves.toEqual(
      safeTx,
    )
  })

  it('should not modify tx if the chain has no migration lib deployed', () => {
    const safeTx = safeTxBuilder()
      .with({ data: safeTxDataBuilder().with({ nonce: 0 }).build() })
      .build()

    const safeInfo = extendedSafeInfoBuilder()
      .with({ implementationVersionState: ImplementationVersionState.UNKNOWN })
      .build()

    expect(
      prependSafeToL2Migration(safeTx, safeInfo, chainBuilder().with({ l2: true, chainId: '69420' }).build()),
    ).resolves.toEqual(safeTx)
  })

  it('should not modify tx if the tx already migrates', () => {
    const safeL2SingletonDeployment = getSafeL2SingletonDeployment()?.defaultAddress

    const safeTx = safeTxBuilder()
      .with({
        data: safeTxDataBuilder()
          .with({
            nonce: 0,
            to: safeToL2MigrationAddress,
            data:
              safeL2SingletonDeployment &&
              safeToL2MigrationInterface.encodeFunctionData('migrateToL2', [safeL2SingletonDeployment]),
          })
          .build(),
      })
      .build()
    const safeInfo = extendedSafeInfoBuilder()
      .with({
        implementationVersionState: ImplementationVersionState.UNKNOWN,
        implementation: {
          name: '1.3.0',
          value: getSafeSingletonDeployment()?.defaultAddress ?? faker.finance.ethereumAddress(),
        },
      })
      .build()
    expect(
      prependSafeToL2Migration(safeTx, safeInfo, chainBuilder().with({ l2: true, chainId: '10' }).build()),
    ).resolves.toEqual(safeTx)
    const multiSendSafeTx = safeTxBuilder()
      .with({
        data: safeTxDataBuilder()
          .with({
            nonce: 0,
            to: getMultiSendDeployment()?.defaultAddress,
            data:
              safeToL2MigrationAddress &&
              safeL2SingletonDeployment &&
              Multi_send__factory.createInterface().encodeFunctionData('multiSend', [
                encodeMultiSendData([
                  {
                    value: '0',
                    operation: 1,
                    to: safeToL2MigrationAddress,
                    data: safeToL2MigrationInterface.encodeFunctionData('migrateToL2', [safeL2SingletonDeployment]),
                  },
                ]),
              ]),
          })
          .build(),
      })
      .build()
    expect(
      prependSafeToL2Migration(multiSendSafeTx, safeInfo, chainBuilder().with({ l2: true, chainId: '10' }).build()),
    ).resolves.toEqual(multiSendSafeTx)
  })

  it('should modify single txs if applicable', async () => {
    const safeTx = safeTxBuilder()
      .with({
        data: safeTxDataBuilder()
          .with({
            nonce: 0,
            to: faker.finance.ethereumAddress(),
            data: faker.string.hexadecimal({ length: 10 }),
            value: '0',
          })
          .build(),
      })
      .build()

    const safeInfo = extendedSafeInfoBuilder()
      .with({
        implementationVersionState: ImplementationVersionState.UNKNOWN,
        implementation: {
          name: '1.3.0',
          value: getSafeSingletonDeployment()?.defaultAddress ?? faker.finance.ethereumAddress(),
        },
      })
      .build()

    const modifiedTx = await prependSafeToL2Migration(
      safeTx,
      safeInfo,
      chainBuilder().with({ l2: true, chainId: '10' }).build(),
    )

    expect(modifiedTx).not.toEqual(safeTx)
    expect(modifiedTx?.data.to).toEqual(getMultiSendDeployment()?.defaultAddress)
    const decodedMultiSend = decodeMultiSendData(modifiedTx!.data.data)
    expect(decodedMultiSend).toHaveLength(2)
    const safeL2SingletonDeployment = getSafeL2SingletonDeployment()?.defaultAddress

    expect(decodedMultiSend).toEqual([
      {
        to: safeToL2MigrationAddress,
        value: '0',
        operation: 1,
        data:
          safeL2SingletonDeployment &&
          safeToL2MigrationInterface.encodeFunctionData('migrateToL2', [safeL2SingletonDeployment]),
      },
      {
        to: checksumAddress(safeTx.data.to),
        value: safeTx.data.value,
        operation: safeTx.data.operation,
        data: safeTx.data.data.toLowerCase(),
      },
    ])
  })
})

describe('extractMigrationL2MasterCopyAddress', () => {
  it('should return undefined for non multisend safeTx', () => {
    expect(
      extractMigrationL2MasterCopyAddress({
        hexData:
          '0xf8dc5dd9000000000000000000000000000000000000000000000000000000000000000100000000000000000000000065f8236309e5a99ff0d129d04e486ebce20dc7b00000000000000000000000000000000000000000000000000000000000000001',
      } as TransactionData),
    ).toBeUndefined()
  })

  it('should return undefined for multisend without migration', () => {
    expect(
      extractMigrationL2MasterCopyAddress({
        hexData: multisendInterface.encodeFunctionData('multiSend', [
          encodeMultiSendData([
            {
              to: faker.finance.ethereumAddress(),
              data: faker.string.hexadecimal({ length: 64 }),
              value: '0',
              operation: 0,
            },
            {
              to: faker.finance.ethereumAddress(),
              data: faker.string.hexadecimal({ length: 64 }),
              value: '0',
              operation: 0,
            },
          ]),
        ]),
      } as TransactionData),
    ).toBeUndefined()
  })

  it('should return migration address for multisend with migration as first tx', () => {
    const l2SingletonAddress = getSafeL2SingletonDeployment()?.defaultAddress!
    expect(
      extractMigrationL2MasterCopyAddress({
        hexData: multisendInterface.encodeFunctionData('multiSend', [
          encodeMultiSendData([
            {
              to: safeToL2MigrationAddress!,
              data: safeToL2MigrationInterface.encodeFunctionData('migrateToL2', [l2SingletonAddress]),
              value: '0',
              operation: 1,
            },
            {
              to: faker.finance.ethereumAddress(),
              data: faker.string.hexadecimal({ length: 64 }),
              value: '0',
              operation: 0,
            },
          ]),
        ]),
      } as TransactionData),
    ).toEqual(l2SingletonAddress)
  })

  describe('createUpdateMigration', () => {
    const mockChain = {
      chainId: '1',
      l2: false,
      recommendedMasterCopyVersion: '1.4.1',
    } as unknown as ChainInfo

    const mockChainOld = {
      chainId: '1',
      l2: false,
      recommendedMasterCopyVersion: '1.3.0',
    } as unknown as ChainInfo

    it('should create a migration transaction for L1 chain', () => {
      const result = createUpdateMigration(mockChain, '1.3.0')

      expect(result).toEqual({
        operation: OperationType.DelegateCall,
        data: '0xed007fc6',
        to: '0x526643F69b81B008F46d95CD5ced5eC0edFFDaC6',
        value: '0',
      })
    })

    it('should create a migration transaction for L2 chain', () => {
      const l2Chain = { ...mockChain, chainId: '137', l2: true }
      const result = createUpdateMigration(l2Chain, '1.3.0+L2')

      expect(result).toEqual({
        operation: OperationType.DelegateCall,
        data: '0x68cb3d94',
        to: '0x526643F69b81B008F46d95CD5ced5eC0edFFDaC6',
        value: '0',
      })
    })

    it('should throw an error if deployment is not found', () => {
      expect(() => createUpdateMigration(mockChainOld, '1.1.1')).toThrow('Migration deployment not found')
    })

    it('should overwrite fallback handler if it is the default one', () => {
      const result = createUpdateMigration(mockChain, '1.3.0', '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4') // 1.3.0 compatibility fallback handler

      expect(result).toEqual({
        operation: OperationType.DelegateCall,
        data: '0xed007fc6',
        to: '0x526643F69b81B008F46d95CD5ced5eC0edFFDaC6',
        value: '0',
      })
    })

    it('should overwrite L2 fallback handler if it is the default one', () => {
      const l2Chain = { ...mockChain, chainId: '137', l2: true }
      const result = createUpdateMigration(l2Chain, '1.3.0+L2', '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4') // 1.3.0 compatibility fallback handler

      expect(result).toEqual({
        operation: OperationType.DelegateCall,
        data: '0x68cb3d94',
        to: '0x526643F69b81B008F46d95CD5ced5eC0edFFDaC6',
        value: '0',
      })
    })

    it('should NOT overwrite a custom fallback handler', () => {
      const result = createUpdateMigration(mockChain, '1.3.0', '0x526643F69b81B008F46d95CD5ced5eC0edFFDaC6')

      expect(result).toEqual({
        operation: OperationType.DelegateCall,
        data: '0xf6682ab0',
        to: '0x526643F69b81B008F46d95CD5ced5eC0edFFDaC6',
        value: '0',
      })
    })
  })
})
