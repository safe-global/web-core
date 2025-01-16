import TokenIcon from '@/components/common/TokenIcon'
import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'
import TxCard from '@/components/tx-flow/common/TxCard'
import commonCss from '@/components/tx-flow/common/styles.module.css'
import AddIcon from '@/public/images/common/add.svg'
import { formatVisualAmount } from '@/utils/formatters'
import { Alert, Button, CardActions, Divider, Grid, SvgIcon, Typography } from '@mui/material'
import { ZERO_ADDRESS } from '@safe-global/protocol-kit/dist/src/utils/constants'
import { type TokenInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { useContext, useEffect, useState, type ReactElement } from 'react'
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
  const [maxRecipientsAlert, setMaxRecipientsAlert] = useState<boolean>(false)
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
  
  const addRecipient = (): void => {
    if (recipientFields.length === 1) {
      setMaxRecipientsAlert(true)
    }
    append({
      recipient: '',
      tokenAddress: ZERO_ADDRESS,
      amount: ''
    })
  }

  useEffect(() => {
    setNonceNeeded(true)
  }, [setNonceNeeded])
  
  return (
    <TxCard>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)} className={commonCss.form}>
          {recipientFields.map((field, i) => (
            <>
              <RecipientRow
                key={field.id}
                index={i}
                removable={i > 0}
                groupName={TokenTransfersFields.recipients}
                remove={removeRecipient}
              />
              {((i < recipientFields.length - 1) || (maxRecipientsAlert && i === 0)) && (
                <Divider sx={{ mb: 3 }} />
              )}
              {maxRecipientsAlert && i === 0 && (
                <Alert
                  severity={'info'}
                  sx={{ mb: 2 }}
                  onClose={() => setMaxRecipientsAlert(false)}
                >
                  If you want to add more than 5 recipients, use CSV Airdrop.
                </Alert>
              )}
            </>
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
                onClick={addRecipient}
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
