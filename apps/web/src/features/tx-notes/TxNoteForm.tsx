import type { TransactionDetails } from '@safe-global/safe-gateway-typescript-sdk'
import TxCard from '@/components/tx-flow/common/TxCard'
import { TxNote } from './TxNote'
import { TxNoteInput } from './TxNoteInput'

export function TxNoteForm({
  isCreation,
  txDetails,
  onChange,
}: {
  isCreation: boolean
  txDetails?: TransactionDetails
  onChange: (note: string) => void
}) {
  // @FIXME: update CGW types to include note
  const note = (txDetails as TransactionDetails & { note: string | null })?.note

  if (!isCreation && !note) return null

  return <TxCard>{isCreation ? <TxNoteInput onChange={onChange} /> : <TxNote txDetails={txDetails} />}</TxCard>
}
