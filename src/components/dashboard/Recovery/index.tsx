import { Box, Button, Card, Grid, Typography } from '@mui/material'
import { useContext } from 'react'
import type { ReactElement } from 'react'

import RecoveryLogo from '@/public/images/common/recovery.svg'
import { WidgetBody, WidgetContainer } from '@/components/dashboard/styled'
import { Chip } from '@/components/common/Chip'
import { TxModalContext } from '@/components/tx-flow'
import { UpsertRecoveryFlow } from '@/components/tx-flow/flows/UpsertRecovery'
import { useRecovery } from '@/components/recovery/RecoveryContext'
import { useRouter } from 'next/router'
import { AppRoutes } from '@/config/routes'
import CheckWallet from '@/components/common/CheckWallet'
import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@/utils/chains'

import css from './styles.module.css'

export function Recovery(): ReactElement {
  const router = useRouter()
  const { setTxFlow } = useContext(TxModalContext)
  const [recovery] = useRecovery()
  const supportsRecovery = useHasFeature(FEATURES.RECOVERY)

  const onEnable = () => {
    setTxFlow(<UpsertRecoveryFlow />)
  }

  const onEdit = () => {
    router.push({
      pathname: AppRoutes.settings.securityLogin,
      query: router.query,
    })
  }

  return (
    <WidgetContainer>
      <Typography component="h2" variant="subtitle1" className={css.label}>
        New in {'Safe{Wallet}'}
      </Typography>

      <WidgetBody>
        <Card className={css.card}>
          <Grid container className={css.grid}>
            <Grid item>
              <RecoveryLogo alt="Vault with a circular arrow around it" />
            </Grid>
            <Grid item xs>
              <Box className={css.wrapper}>
                <Typography variant="h4" className={css.title}>
                  Introducing account recovery{' '}
                </Typography>
                <Chip label="New" />
              </Box>
              <Typography mt={1} mb={3}>
                Ensure that you never lose access to your funds by choosing a guardian to recover your account.
              </Typography>
              {supportsRecovery && (
                <CheckWallet>
                  {(isOk) => {
                    if (!recovery || recovery.length === 0) {
                      return (
                        <Button variant="contained" disabled={!isOk} onClick={onEnable}>
                          Set up recovery
                        </Button>
                      )
                    }

                    return (
                      <Button variant="contained" disabled={!isOk} onClick={onEdit}>
                        Edit recovery
                      </Button>
                    )
                  }}
                </CheckWallet>
              )}
            </Grid>
          </Grid>
        </Card>
      </WidgetBody>
    </WidgetContainer>
  )
}
