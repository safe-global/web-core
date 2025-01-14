import { useCallback, useState } from 'react'
import { InputAdornment, Stack, TextField, Typography } from '@mui/material'
import InfoIcon from '@/public/images/notifications/info.svg'

const MAX_NOTE_LENGTH = 120

export const TxNoteInput = ({ onChange }: { onChange: (note: string) => void }) => {
  const [note, setNote] = useState('')

  const onInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value)
  }, [])

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value.slice(0, MAX_NOTE_LENGTH))
    },
    [onChange],
  )

  return (
    <>
      <Stack direction="row" alignItems="flex-end" gap={1}>
        <Typography variant="h5">What does this transaction do?</Typography>
        <Typography variant="body2" color="text.secondary">
          Optional
        </Typography>
      </Stack>

      <TextField
        name="note"
        label="Add note"
        fullWidth
        slotProps={{
          htmlInput: { maxLength: MAX_NOTE_LENGTH },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption" mt={3}>
                  {note.length}/{MAX_NOTE_LENGTH}
                </Typography>
              </InputAdornment>
            ),
          },
        }}
        onInput={onInput}
        onChange={onInputChange}
      />

      <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
        <InfoIcon height="1.2em" />
        This note will be publicly visible and accessible to anyone.
      </Typography>
    </>
  )
}
