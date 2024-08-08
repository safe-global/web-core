import { fireEvent, render } from '@/tests/test-utils'
import { type SafeTransaction } from '@safe-global/safe-core-sdk-types'
import DecodedTx from '.'
import { waitFor } from '@testing-library/react'

describe('DecodedTx', () => {
  it('should render a native transfer', async () => {
    const result = render(
      <DecodedTx
        tx={
          {
            data: {
              to: '0x3430d04E42a722c5Ae52C5Bffbf1F230C2677600',
              value: '1000000',
              data: '0x',
              operation: 0,
              baseGas: '0',
              gasPrice: '0',
              gasToken: '0x0000000000000000000000000000000000000000',
              refundReceiver: '0x0000000000000000000000000000000000000000',
              nonce: 58,
              safeTxGas: '0',
            },
          } as SafeTransaction
        }
        decodedData={{
          method: '',
          parameters: [
            {
              name: 'to',
              type: 'address',
              value: '0x3430d04E42a722c5Ae52C5Bffbf1F230C2677600',
            },
            {
              name: 'value',
              type: 'uint256',
              value: '1000000',
            },
          ],
        }}
        showMethodCall
      />,
    )

    expect(result.queryByText('Value:')).toBeInTheDocument()

    fireEvent.click(result.getByText('Advanced details'))

    await waitFor(() => {
      expect(result.queryByText('safeTxGas:')).toBeInTheDocument()
      expect(result.queryByText('Raw data:')).toBeInTheDocument()
    })
  })

  it('should render an ERC20 transfer', async () => {
    const result = render(
      <DecodedTx
        tx={
          {
            data: {
              to: '0x3430d04E42a722c5Ae52C5Bffbf1F230C2677600',
              value: '0',
              data: '0xa9059cbb000000000000000000000000474e5ded6b5d078163bfb8f6dba355c3aa5478c80000000000000000000000000000000000000000000000008ac7230489e80000',
              operation: 0,
              baseGas: '0',
              gasPrice: '0',
              gasToken: '0x0000000000000000000000000000000000000000',
              refundReceiver: '0x0000000000000000000000000000000000000000',
              nonce: 58,
              safeTxGas: '0',
            },
          } as SafeTransaction
        }
        decodedData={{
          method: 'transfer',
          parameters: [
            {
              name: 'to',
              type: 'address',
              value: '0x474e5Ded6b5D078163BFB8F6dBa355C3aA5478C8',
            },
            {
              name: 'value',
              type: 'uint256',
              value: '16745726664999765048',
            },
          ],
        }}
        showMethodCall
      />,
    )

    fireEvent.click(result.getByText('Advanced details'))

    await waitFor(() => {
      expect(result.queryByText('transfer')).toBeInTheDocument()
      expect(result.queryByText('Parameters')).toBeInTheDocument()
      expect(result.queryByText('to')).toBeInTheDocument()
      expect(result.queryByText('address')).toBeInTheDocument()
      expect(result.queryByText('0x474e...78C8')).toBeInTheDocument()
      expect(result.queryByText('value')).toBeInTheDocument()
      expect(result.queryByText('uint256')).toBeInTheDocument()
      expect(result.queryByText('16745726664999765048')).toBeInTheDocument()
    })
  })

  it('should render a multisend transaction', async () => {
    const result = render(
      <DecodedTx
        tx={
          {
            data: {
              to: '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
              value: '0',
              data: '0x8d80ff00',
              operation: 1,
              baseGas: '0',
              gasPrice: '0',
              gasToken: '0x0000000000000000000000000000000000000000',
              refundReceiver: '0x0000000000000000000000000000000000000000',
              nonce: 58,
              safeTxGas: '0',
            },
          } as SafeTransaction
        }
        decodedData={{
          method: 'multiSend',
          parameters: [
            {
              name: 'transactions',
              type: 'bytes',
              value: '0x0057f1887a8bf19b14fc0df',
              valueDecoded: [
                {
                  operation: 0,
                  to: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
                  value: '0',
                  data: '0x42842e0e0000000000000000000',
                  dataDecoded: {
                    method: 'safeTransferFrom',
                    parameters: [
                      {
                        name: 'from',
                        type: 'address',
                        value: '0xA77DE01e157f9f57C7c4A326eeE9C4874D0598b6',
                      },
                      {
                        name: 'to',
                        type: 'address',
                        value: '0x474e5Ded6b5D078163BFB8F6dBa355C3aA5478C8',
                      },
                      {
                        name: 'tokenId',
                        type: 'uint256',
                        value: '52964617156216674852059480948658573966398315289847646343083345905048987083870',
                      },
                    ],
                  },
                },
                {
                  operation: 0,
                  to: '0xD014e20A75437a4bd0FbB40498FF94e6F337c3e9',
                  value: '0',
                  data: '0x42842e0e000000000000000000000000a77de',
                  dataDecoded: {
                    method: 'safeTransferFrom',
                    parameters: [
                      {
                        name: 'from',
                        type: 'address',
                        value: '0xA77DE01e157f9f57C7c4A326eeE9C4874D0598b6',
                      },
                      {
                        name: 'to',
                        type: 'address',
                        value: '0x474e5Ded6b5D078163BFB8F6dBa355C3aA5478C8',
                      },
                      {
                        name: 'tokenId',
                        type: 'uint256',
                        value: '412',
                      },
                    ],
                  },
                },
              ],
            },
          ],
        }}
        showMethodCall
      />,
    )

    expect(result.queryAllByText('safeTransferFrom').length).toBeGreaterThan(1)
  })

  it('should render a function call without parameters', async () => {
    const result = render(
      <DecodedTx
        tx={
          {
            data: {
              to: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
              value: '5000000000000',
              data: '0xd0e30db0',
              operation: 0,
              baseGas: '0',
              gasPrice: '0',
              gasToken: '0x0000000000000000000000000000000000000000',
              refundReceiver: '0x0000000000000000000000000000000000000000',
              nonce: 58,
              safeTxGas: '0',
            },
          } as SafeTransaction
        }
        decodedData={{
          method: 'deposit',
          parameters: [],
        }}
        showMethodCall
      />,
    )

    fireEvent.click(result.getByText('Advanced details'))

    expect(result.queryByText('deposit')).toBeInTheDocument()
  })
})
