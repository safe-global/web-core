import EnhancedTable from '@/components/common/EnhancedTable'
import { useState } from 'react'
import EntryDialog, { AddressEntry } from '@/components/address-book/EntryDialog'
import ExportDialog from '@/components/address-book/ExportDialog'
import ImportDialog from '@/components/address-book/ImportDialog'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import RemoveDialog from '@/components/address-book/RemoveDialog'
import useIsSafeOwner from '@/hooks/useIsSafeOwner'
import TokenTransferModal from '@/components/tx/modals/TokenTransferModal'
import css from './styles.module.css'
import EthHashInfo from '@/components/common/EthHashInfo'
import AddressBookHeader from '../AddressBookHeader'
import useAddressBook from '@/hooks/useAddressBook'
import Track from '@/components/common/Track'
import { ADDRESS_BOOK_EVENTS } from '@/services/analytics/events/addressBook'

const headCells = [
  { id: 'name', label: 'Name' },
  { id: 'address', label: 'Address' },
  { id: 'actions', label: '' },
]

export enum ModalType {
  EXPORT = 'export',
  IMPORT = 'import',
  ENTRY = 'entry',
  REMOVE = 'remove',
}

const defaultOpen = {
  [ModalType.EXPORT]: false,
  [ModalType.IMPORT]: false,
  [ModalType.ENTRY]: false,
  [ModalType.REMOVE]: false,
}

const AddressBookTable = () => {
  const isSafeOwner = useIsSafeOwner()
  const [open, setOpen] = useState<typeof defaultOpen>(defaultOpen)
  const [defaultValues, setDefaultValues] = useState<AddressEntry | undefined>(undefined)
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>()

  const handleOpenModal = (type: keyof typeof open) => () => {
    setOpen((prev) => ({ ...prev, [type]: true }))
  }

  const handleOpenModalWithValues = (modal: ModalType, address: string, name: string) => {
    setDefaultValues({ address, name })
    handleOpenModal(modal)()
  }

  const handleClose = () => {
    setOpen(defaultOpen)
    setDefaultValues(undefined)
  }

  const addressBook = useAddressBook()
  const addressBookEntries = Object.entries(addressBook)

  const rows = addressBookEntries.map(([address, name]) => ({
    name: {
      rawValue: name,
      content: name,
    },
    address: {
      rawValue: address,
      content: <EthHashInfo address={address} showName={false} shortAddress={false} hasExplorer showCopyButton />,
    },
    actions: {
      rawValue: '',
      content: (
        <div className={css.entryButtonWrapper}>
          <Track {...ADDRESS_BOOK_EVENTS.EDIT_ENTRY}>
            <Tooltip title="Edit entry" placement="top">
              <IconButton onClick={() => handleOpenModalWithValues(ModalType.ENTRY, address, name)} size="small">
                <EditIcon color="border" />
              </IconButton>
            </Tooltip>
          </Track>

          <Track {...ADDRESS_BOOK_EVENTS.DELETE_ENTRY}>
            <Tooltip title="Delete entry" placement="top">
              <IconButton onClick={() => handleOpenModalWithValues(ModalType.REMOVE, address, name)} size="small">
                <DeleteOutlineIcon color="error" />
              </IconButton>
            </Tooltip>
          </Track>

          {isSafeOwner && (
            <Track {...ADDRESS_BOOK_EVENTS.SEND}>
              <Button variant="contained" color="primary" onClick={() => setSelectedAddress(address)}>
                Send
              </Button>
            </Track>
          )}
        </div>
      ),
    },
  }))

  return (
    <>
      <AddressBookHeader handleOpenModal={handleOpenModal} />
      <main>
        <EnhancedTable rows={rows} headCells={headCells} />
      </main>

      {open[ModalType.EXPORT] && <ExportDialog handleClose={handleClose} />}

      {open[ModalType.IMPORT] && <ImportDialog handleClose={handleClose} />}

      {open[ModalType.ENTRY] && <EntryDialog handleClose={handleClose} defaultValues={defaultValues} />}

      {open[ModalType.REMOVE] && <RemoveDialog handleClose={handleClose} address={defaultValues?.address || ''} />}

      {/* Send funds modal */}
      {selectedAddress && (
        <TokenTransferModal
          onClose={() => setSelectedAddress(undefined)}
          initialData={[{ recipient: selectedAddress }]}
        />
      )}
    </>
  )
}

export default AddressBookTable
