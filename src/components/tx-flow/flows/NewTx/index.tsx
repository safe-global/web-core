import { useCallback, useContext } from 'react'
import { SendNFTsButton, SendTokensButton, TxBuilderButton } from '@/components/tx-flow/common/TxButton'
import { Container, Grid, Paper, SvgIcon, Typography } from '@mui/material'
import { TxModalContext } from '../../'
import TokenTransferFlow from '../TokenTransfer'
import AssetsIcon from '@/public/images/sidebar/assets.svg'
import { useTxBuilderApp } from '@/hooks/safe-apps/useTxBuilderApp'
import { ProgressBar } from '@/components/common/ProgressBar'
import ChainIndicator from '@/components/common/ChainIndicator'
import NewTxIcon from '@/public/images/transactions/new-tx.svg'

import css from './styles.module.css'

const buttonSx = { height: '58px' }

const NewTxMenu = () => {
  const txBuilder = useTxBuilderApp()
  const { setTxFlow } = useContext(TxModalContext)

  const onTokensClick = useCallback(() => {
    setTxFlow(<TokenTransferFlow />)
  }, [setTxFlow])

  const progress = 10

  return (
    <Container className={css.container}>
      <Grid container>
        {/* Alignment of `TxLayout` */}
        <Grid item xs={12} md={11} display="flex" flexDirection="column">
          <ChainIndicator inline className={css.chain} />

          <Grid container component={Paper}>
            <Grid item xs={12} className={css.progressBar}>
              <ProgressBar value={progress} />
            </Grid>
            <Grid item xs={12} md={6} className={css.pane} gap={3}>
              <div className={css.globs}>
                <NewTxIcon />
              </div>

              <Typography variant="h1" className={css.title}>
                New transaction
              </Typography>
            </Grid>

            <Grid item xs={12} md={5} className={css.pane} gap={2}>
              <Typography variant="h4" className={css.type}>
                <SvgIcon component={AssetsIcon} inheritViewBox />
                Assets
              </Typography>

              <SendTokensButton onClick={onTokensClick} sx={buttonSx} />

              <SendNFTsButton sx={buttonSx} />

              {txBuilder?.app && (
                <>
                  <Typography variant="h4" className={css.type} mt={3}>
                    <img src={txBuilder.app.iconUrl} height={24} width="auto" alt={txBuilder.app.name} /> Contract
                    interaction
                  </Typography>

                  <TxBuilderButton sx={buttonSx} />
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default NewTxMenu
