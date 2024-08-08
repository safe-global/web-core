import type { ReactElement } from 'react'
import { generateDataRowValue, TxDataRow } from '@/components/transactions/TxDetails/Summary/TxDataRow'
import { isAddress, isArrayParameter, isByte } from '@/utils/transaction-guards'
import type { AddressEx, DataDecoded } from '@safe-global/safe-gateway-typescript-sdk'
import { Box, Typography } from '@mui/material'
import { Value } from '@/components/transactions/TxDetails/TxData/DecodedData/ValueArray'

type MethodDetailsProps = {
  data: DataDecoded
  addressInfoIndex?: {
    [key: string]: AddressEx
  }
}

export const MethodDetails = ({ data, addressInfoIndex }: MethodDetailsProps): ReactElement | null => {
  if (!data.parameters?.length) {
    return <Typography color="text.secondary">No parameters</Typography>
  }

  return (
    <Box>
      <Typography fontWeight="bold" pb={1}>
        Parameters
      </Typography>

      {data.parameters?.map((param, index) => {
        const isArrayValueParam = isArrayParameter(param.type) || Array.isArray(param.value)
        const inlineType = isAddress(param.type) ? 'address' : isByte(param.type) ? 'bytes' : undefined
        const addressEx = typeof param.value === 'string' ? addressInfoIndex?.[param.value] : undefined

        const title = (
          <>
            <Typography component="span">{param.name}</Typography>{' '}
            <Typography component="span" color="text.secondary">
              {param.type}
            </Typography>
          </>
        )

        return (
          <TxDataRow key={`${data.method}_param-${index}`} title={title}>
            {isArrayValueParam ? (
              <Value method={data.method} type={param.type} value={param.value as string} />
            ) : (
              generateDataRowValue(param.value as string, inlineType, true, addressEx)
            )}
          </TxDataRow>
        )
      })}
    </Box>
  )
}
