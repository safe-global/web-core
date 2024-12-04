import { render } from '@/src/tests/test-utils'
import { TxBatchCard } from '.'
import { mockTransferWithInfo } from '@/src/tests/mocks'
import { MultiSend, TransactionInfoType } from '@/src/store/gateway/types'

describe('TxBatchCard', () => {
  it('should render the default markup', () => {
    const container = render(
      <TxBatchCard
        txInfo={
          mockTransferWithInfo({
            type: TransactionInfoType.CUSTOM,
            actionCount: 2,
            to: {
              value: '',
              logoUri: 'http://myAsset.com/asset.png',
              name: 'Gnosis Bridge',
            },
          }) as MultiSend
        }
      />,
    )

    expect(container.getByText('Batch')).toBeTruthy()
    expect(container.getByText('2 actions')).toBeTruthy()
    expect(container).toMatchSnapshot()
  })
})