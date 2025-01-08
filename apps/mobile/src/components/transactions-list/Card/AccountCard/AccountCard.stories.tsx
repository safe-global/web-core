import type { Meta, StoryObj } from '@storybook/react'
import { AccountCard } from '@/src/components/transactions-list/Card/AccountCard'
import { mockedActiveSafeInfo, mockedChains } from '@/src/store/constants'
import { Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import { Address } from '@/src/types/address'
import { SafeFontIcon } from '@/src/components/SafeFontIcon'

const meta: Meta<typeof AccountCard> = {
  title: 'TransactionsList/AccountCard',
  component: AccountCard,
  argTypes: {},
}

export default meta

type Story = StoryObj<typeof AccountCard>

export const Default: Story = {
  args: {
    name: 'This is my account',
    chains: mockedChains as unknown as Chain[],
    owners: 5,
    balance: mockedActiveSafeInfo.fiatTotal,
    address: mockedActiveSafeInfo.address.value as Address,
    threshold: 2,
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: ({ ...args }) => <AccountCard {...args} rightNode={<SafeFontIcon name="check" />} />,
}

export const TruncatedAccount: Story = {
  args: {
    name: 'This is my account with a very long text in one more test',
    chains: mockedChains as unknown as Chain[],
    owners: 5,
    balance: mockedActiveSafeInfo.fiatTotal,
    address: mockedActiveSafeInfo.address.value as Address,
    threshold: 2,
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: ({ ...args }) => <AccountCard {...args} rightNode={<SafeFontIcon name="check" />} />,
}
