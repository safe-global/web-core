import type { Meta, StoryObj } from '@storybook/react'
import { ChainsDisplay } from '@/src/components/ChainsDisplay'
import { mockedChains } from '@/src/store/constants'
import { Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'

const meta: Meta<typeof ChainsDisplay> = {
  title: 'ChainsDisplay',
  component: ChainsDisplay,
  argTypes: {},
}

export default meta

type Story = StoryObj<typeof ChainsDisplay>

export const Default: Story = {
  args: {
    chains: mockedChains as unknown as Chain[],
    max: 3,
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export const Truncated: Story = {
  args: {
    chains: mockedChains as unknown as Chain[],
    max: 1,
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export const ActiveChain: Story = {
  args: {
    chains: mockedChains as unknown as Chain[],
    activeChainId: mockedChains[1].chainId,
    max: 1,
  },
  parameters: {
    layout: 'fullscreen',
  },
}
