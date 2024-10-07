import TxLayout from '@/components/tx-flow/common/TxLayout'
import { ReviewEnableSafenet } from './ReviewEnableSafenet'

export type EnableSafenetFlowProps = {
  guardAddress: string
  tokensForPresetAllowances: string[]
}

const EnableSafenetFlow = ({ guardAddress, tokensForPresetAllowances }: EnableSafenetFlowProps) => {
  return (
    <TxLayout title="Confirm transaction" subtitle="Enable SafeNet">
      <ReviewEnableSafenet params={{ guardAddress, tokensForPresetAllowances }} />
    </TxLayout>
  )
}

export { EnableSafenetFlow }
