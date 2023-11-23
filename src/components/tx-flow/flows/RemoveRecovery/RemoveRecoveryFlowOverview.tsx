import { Button, CardActions, Divider, Typography } from '@mui/material'
import type { ReactElement } from 'react'

import EthHashInfo from '@/components/common/EthHashInfo'
import TxCard from '../../common/TxCard'
import type { RecoveryFlowProps } from '.'

import commonCss from '@/components/tx-flow/common/styles.module.css'

export function RemoveRecoveryFlowOverview({
  delayModifier,
  onSubmit,
}: RecoveryFlowProps & { onSubmit: () => void }): ReactElement {
  return (
    <TxCard>
      <Typography variant="body2">
        This transaction will remove the recovery module from your Safe Account. You will no longer be able to recover
        your Safe Account.
      </Typography>

      <Typography variant="body2">
        This guardian will not be able to start the initiate the recovery progress once this transaction is executed.
      </Typography>

      <div>
        <Typography variant="body2" color="text.secondary" mb={1}>
          Removing guardian
        </Typography>

        {delayModifier.guardians.map((guardian) => (
          <EthHashInfo
            avatarSize={32}
            key={guardian}
            shortAddress={false}
            address={guardian}
            hasExplorer
            showCopyButton
          />
        ))}
      </div>

      <Divider className={commonCss.nestedDivider} />

      <CardActions sx={{ mt: '0 !important' }}>
        <Button variant="contained" onClick={onSubmit}>
          Next
        </Button>
      </CardActions>
    </TxCard>
  )
}
