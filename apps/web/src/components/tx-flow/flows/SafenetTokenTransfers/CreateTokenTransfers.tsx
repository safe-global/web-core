import TokenIcon from '@/components/common/TokenIcon'
import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'
import TxCard from '@/components/tx-flow/common/TxCard'
import commonCss from '@/components/tx-flow/common/styles.module.css'
import AddIcon from '@/public/images/common/add.svg'
import { formatVisualAmount } from '@/utils/formatters'
import { Button, CardActions, Divider, Grid, SvgIcon, Typography } from '@mui/material'
import { ZERO_ADDRESS } from '@safe-global/protocol-kit/dist/src/utils/constants'
import { type TokenInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { useContext, useEffect, type ReactElement } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { TokenTransfersFields, type TokenTransfersParams } from '.'
import RecipientRow from './RecipientRow'

export const AutocompleteItem = (item: { tokenInfo: TokenInfo; balance: string }): ReactElement => (
  <Grid
    container
    sx={{
      alignItems: 'center',
      gap: 1,
    }}
  >
    <TokenIcon logoUri={item.tokenInfo.logoUri} key={item.tokenInfo.address} tokenSymbol={item.tokenInfo.symbol} />

    <Grid item xs>
      <Typography
        variant="body2"
        sx={{
          whiteSpace: 'normal',
        }}
      >
        {item.tokenInfo.name}
      </Typography>

      <Typography variant="caption" component="p">
        {formatVisualAmount(item.balance, item.tokenInfo.decimals)} {item.tokenInfo.symbol}
      </Typography>
    </Grid>
  </Grid>
)

export const CreateTokenTransfers = ({
  params,
  onSubmit,
  txNonce,
}: {
  params: TokenTransfersParams
  onSubmit: (data: TokenTransfersParams) => void
  txNonce?: number
}): ReactElement => {
  const { setNonce, setNonceNeeded } = useContext(SafeTxContext)

  useEffect(() => {
    if (txNonce !== undefined) {
      setNonce(txNonce)
    }
  }, [setNonce, txNonce])

  const formMethods = useForm<TokenTransfersParams>({
    defaultValues: {
      ...params,
    },
    mode: 'onChange',
    delayError: 500,
  })

  const {
    handleSubmit,
    control
  } = formMethods

  const {
    fields: recipientFields,
    append,
    remove,
  } = useFieldArray({ control, name: TokenTransfersFields.recipients })

  const removeRecipient = (index: number): void => {
    remove(index)
  }
  
  useEffect(() => {
    setNonceNeeded(true)
  }, [setNonceNeeded])
  
  return (
    <TxCard>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)} className={commonCss.form}>
          {recipientFields.map((field, i) => (
            <RecipientRow
              key={field.id}
              index={i}
              removable={i > 0}
              groupName={TokenTransfersFields.recipients}
              remove={removeRecipient}
            />
          ))}

          <Grid 
            xs={12}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 4
            }}
            >
            {recipientFields.length < 5 && (
              <Button
                data-testid="add-recipient-btn"
                variant="text"
                onClick={() => append({
                  recipient: '',
                  tokenAddress: ZERO_ADDRESS,
                  amount: ''
                })}
                startIcon={<SvgIcon component={AddIcon} inheritViewBox fontSize="small" />}
                size="large"
              >
                Add new recipient
              </Button>
            )}
            <Typography variant="body2">
              {`${recipientFields.length}/5`}
            </Typography>
          </Grid>

          <Divider className={commonCss.nestedDivider} />

          <CardActions>
            <Button variant="contained" type="submit">
              Next
            </Button>
          </CardActions>
        </form>
      </FormProvider>
    </TxCard>
  )
}

export default CreateTokenTransfers
