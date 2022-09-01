import { AccordionSummary, Accordion, Button, Typography, CircularProgress } from '@mui/material'
import { ReactElement } from 'react'

import Track from '@/components/common/Track'
import { useCurrentChain } from '@/hooks/useChains'
import useSafeInfo from '@/hooks/useSafeInfo'
import useWallet from '@/hooks/wallets/useWallet'
import { MODALS_EVENTS } from '@/services/analytics'
import { SimulationResult } from '@/components/tx/TxSimulation/SimulationResult'
import { FETCH_STATUS } from '@/components/tx/TxSimulation/types'
import { useSimulation } from '@/components/tx/TxSimulation/useSimulation'
import { isTxSimulationEnabled } from '@/components/tx/TxSimulation/utils'
import type { SimulationTxParams } from '@/components/tx/TxSimulation/utils'

import css from './styles.module.css'

export type TxSimulationProps = {
  transactions: SimulationTxParams['transactions']
  canExecute: boolean
  disabled: boolean
}

const TxSimulationBlock = ({ transactions, canExecute, disabled }: TxSimulationProps): ReactElement => {
  const { safe } = useSafeInfo()
  const wallet = useWallet()

  const { simulateTransaction, simulation, simulationRequestStatus, simulationLink, requestError, resetSimulation } =
    useSimulation()

  const handleSimulation = async () => {
    if (!wallet) {
      return
    }

    simulateTransaction({
      safe,
      executionOwner: wallet.address,
      transactions,
      canExecute,
    })
  }

  const isSimulationFinished =
    simulationRequestStatus === FETCH_STATUS.ERROR || simulationRequestStatus === FETCH_STATUS.SUCCESS
  const isSimulationLoading = simulationRequestStatus === FETCH_STATUS.LOADING

  return (
    <Accordion expanded={isSimulationFinished} elevation={0} sx={{ mt: 2 }}>
      {!isSimulationFinished ? (
        <AccordionSummary className={css.simulateAccordion}>
          <Typography>Transaction validity</Typography>
          <Track {...MODALS_EVENTS.SIMULATE_TX}>
            <Button
              variant="text"
              size="small"
              disabled={disabled || isSimulationLoading}
              color="primary"
              onClick={handleSimulation}
            >
              {isSimulationLoading && <CircularProgress size={14} />}
              <span>{isSimulationLoading ? 'Simulating...' : 'Simulate'}</span>
            </Button>
          </Track>
        </AccordionSummary>
      ) : (
        <SimulationResult
          onClose={resetSimulation}
          simulation={simulation}
          simulationRequestStatus={simulationRequestStatus}
          simulationLink={simulationLink}
          requestError={requestError}
        />
      )}
    </Accordion>
  )
}

export const TxSimulation = (props: TxSimulationProps): ReactElement | null => {
  const chain = useCurrentChain()
  if (!chain || !isTxSimulationEnabled(chain)) {
    return null
  }

  return <TxSimulationBlock {...props} />
}
