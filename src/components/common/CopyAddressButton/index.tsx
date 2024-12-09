import { checksumAddress } from '@/utils/addresses'
import { Stack, Typography } from '@mui/material'
import type { ReactNode, ReactElement } from 'react'
import CopyButton from '../CopyButton'
import EthHashInfo from '../EthHashInfo'

const CopyAddressButton = ({
  prefix,
  address,
  copyPrefix,
  children,
  trusted = true,
}: {
  prefix?: string
  address: string
  copyPrefix?: boolean
  children?: ReactNode
  trusted?: boolean
}): ReactElement => {
  const addressText = copyPrefix && prefix ? `${prefix}:${address}` : address

  const checksummedAddress = checksumAddress(address)

  const dialogContent = trusted ? undefined : (
    <Stack spacing={2}>
      <EthHashInfo
        address={checksummedAddress}
        shortAddress={false}
        copyAddress={false}
        showCopyButton={false}
        hasExplorer
      />
      <Typography>
        The copied address is linked to a transaction with an untrusted token. Make sure you are interacting with the
        right address.
      </Typography>
    </Stack>
  )

  return (
    <CopyButton text={addressText} dialogContent={dialogContent}>
      {children}
    </CopyButton>
  )
}

export default CopyAddressButton
