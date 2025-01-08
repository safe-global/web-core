import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { _UpdateSafe as UpdateSafe } from './index'
import { render } from '@/tests/test-utils'

const chain = {
  recommendedMasterCopyVersion: '1.4.1',
} as ChainInfo

const warningText = 'This upgrade will invalidate all queued transactions!'

describe('Container', () => {
  it('renders correctly with a queue warning', async () => {
    const container = render(<UpdateSafe safeVersion="1.1.1" queueSize="10+" chain={chain} />)
    await expect(container.findByText(warningText)).resolves.not.toBeNull()
  })

  it('renders correctly without a queue warning because no queue', async () => {
    const container = render(<UpdateSafe safeVersion="1.1.1" queueSize="" chain={chain} />)
    await expect(container.findByText(warningText)).rejects.toThrowError(Error)
  })

  it('renders correctly without a queue warning because of compatible Safe version', async () => {
    const container = render(<UpdateSafe safeVersion="1.3.0" queueSize="10" chain={chain} />)
    await expect(container.findByText(warningText)).rejects.toThrowError(Error)
  })
})
