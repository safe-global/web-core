import { useContext } from 'react'
import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'
import SignOrExecuteForm from './SignOrExecuteForm'
import type { SignOrExecuteProps, SubmitCallback } from './SignOrExecuteForm'
import SignOrExecuteSkeleton from './SignOrExecuteSkeleton'
import useTxDetails from '@/hooks/useTxDetails'

type SignOrExecuteExtendedProps = Omit<SignOrExecuteProps, 'txId'> & {
  onSubmit?: SubmitCallback
  txId?: string
  children?: React.ReactNode
  isExecutable?: boolean
  isRejection?: boolean
  isBatch?: boolean
  isBatchable?: boolean
  onlyExecute?: boolean
  disableSubmit?: boolean
  origin?: string
  isCreation?: boolean
  showMethodCall?: boolean
}

const SignOrExecute = (props: SignOrExecuteExtendedProps) => {
  const { safeTx } = useContext(SafeTxContext)
  const [txDetails, , error] = useTxDetails(props.txId)

  // Show the loader only the first time the tx is being loaded
  if (!safeTx || (props.txId && !txDetails && !error)) {
    return <SignOrExecuteSkeleton />
  }

  return (
    <SignOrExecuteForm {...props} isCreation={!props.txId} txId={props.txId} txDetails={txDetails}>
      {props.children}
    </SignOrExecuteForm>
  )
}

export default SignOrExecute
