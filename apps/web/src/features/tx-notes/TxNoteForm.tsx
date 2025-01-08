import type { TransactionDetails } from '@safe-global/safe-gateway-typescript-sdk'
import TxCard from '@/components/tx-flow/common/TxCard'
import { TxNote } from './TxNote'
import { TxNoteInput } from './TxNoteInput'

export function TxNoteForm({
  isCreation,
  txDetails,
  onSubmit,
}: {
  isCreation: boolean
  txDetails?: TransactionDetails
  onSubmit: (note: string) => void
}) {
  return <TxCard>{isCreation ? <TxNoteInput onSubmit={onSubmit} /> : <TxNote txDetails={txDetails} />}</TxCard>
}
