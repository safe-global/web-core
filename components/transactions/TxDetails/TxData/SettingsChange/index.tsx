import { ReactElement, ReactNode } from 'react'
import { SettingsChange } from '@gnosis.pm/safe-react-gateway-sdk'
import { AddressInfo } from '@/components/transactions/TxDetails/TxData'
import css from './styles.module.css'

interface Props {
  settingsInfo: SettingsChange['settingsInfo']
}

type InfoDetailsProps = {
  header?: string | ReactElement
  children: ReactNode
  title: string | ReactElement
}

const ThresholdWarning = (): ReactElement => (
  // TODO: style the warning
  // <AlertTooltipWarning
  //   tooltip="This transaction potentially alters the number of confirmations required to execute a transaction."
  //   message="Confirmation policy change"
  //   isWarning
  // />
  <div>Confirmation policy change</div>
)

export const InfoDetails = ({ header, children, title }: InfoDetailsProps): ReactElement => (
  <div className={css.txInfoDetails}>
    {header}
    <span className={css.txInfoDetailsTitle}>{title}</span>
    {children}
  </div>
)

export const SettingsChangeTxInfo = ({ settingsInfo }: Props): ReactElement | null => {
  if (!settingsInfo) {
    return null
  }

  switch (settingsInfo.type) {
    case 'SET_FALLBACK_HANDLER': {
      return (
        <InfoDetails title="Set fallback handler:">
          <AddressInfo
            address={settingsInfo.handler.value}
            // name={settingsInfo.handler?.name || undefined}
            // avatarUrl={settingsInfo.handler?.logoUri || undefined}
          />
        </InfoDetails>
      )
    }
    case 'ADD_OWNER':
    case 'REMOVE_OWNER': {
      const title = settingsInfo.type === 'ADD_OWNER' ? 'Add owner:' : 'Remove owner:'
      return (
        <InfoDetails title={title} header={<ThresholdWarning />}>
          <AddressInfo
            address={settingsInfo.owner.value}
            // name={settingsInfo.owner?.name || undefined}
            // avatarUrl={settingsInfo.owner?.logoUri || undefined}
          />
          <InfoDetails title="Increase/decrease confirmation policy to:">{settingsInfo.threshold}</InfoDetails>
        </InfoDetails>
      )
    }
    // case 'SWAP_OWNER': {
    //   return (
    //     <InfoDetails title="Swap owner:">
    //       <TxInfoDetails
    //         title="Old owner"
    //         address={settingsInfo.oldOwner.value}
    //         name={settingsInfo.oldOwner?.name || undefined}
    //         avatarUrl={settingsInfo.oldOwner?.logoUri || undefined}
    //       />
    //       <TxInfoDetails
    //         title="New owner"
    //         address={settingsInfo.newOwner.value}
    //         name={settingsInfo.newOwner?.name || undefined}
    //         avatarUrl={settingsInfo.newOwner?.logoUri || undefined}
    //       />
    //     </InfoDetails>
    //   )
    // }
    case 'CHANGE_THRESHOLD': {
      return (
        <InfoDetails title="Increase/decrease confirmation policy to:" header={<ThresholdWarning />}>
          {settingsInfo.threshold}
        </InfoDetails>
      )
    }
    // case 'CHANGE_IMPLEMENTATION': {
    //   return (
    //     <InfoDetails title="Change implementation:">
    //       <AddressInfo
    //         address={settingsInfo.implementation.value}
    //         name={settingsInfo.implementation?.name || undefined}
    //         avatarUrl={settingsInfo.implementation?.logoUri || undefined}
    //       />
    //     </InfoDetails>
    //   )
    // }
    // case 'ENABLE_MODULE':
    // case 'DISABLE_MODULE': {
    //   const title = settingsInfo.type === 'ENABLE_MODULE' ? 'Enable module:' : 'Disable module:'
    //   return (
    //     <InfoDetails title={title}>
    //       <AddressInfo
    //         address={settingsInfo.module.value}
    //         name={settingsInfo.module?.name || undefined}
    //         avatarUrl={settingsInfo.module?.logoUri || undefined}
    //       />
    //     </InfoDetails>
    //   )
    // }
    // case 'SET_GUARD': {
    //   return (
    //     <InfoDetails title="Set guard:">
    //       <AddressInfo
    //         address={settingsInfo.guard.value}
    //         name={settingsInfo.guard?.name || undefined}
    //         avatarUrl={settingsInfo.guard?.logoUri || undefined}
    //       />
    //     </InfoDetails>
    //   )
    // }
    // case 'DELETE_GUARD': {
    //   return <InfoDetails title="Delete guard">{null}</InfoDetails>
    // }
    default:
      // return <InfoDetails title={(settingsInfo as SettingsInfo).type}>{null}</InfoDetails>
      return <></>
  }
}

export default SettingsChangeTxInfo
