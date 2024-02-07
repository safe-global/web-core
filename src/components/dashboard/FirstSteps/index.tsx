import useBalances from '@/hooks/useBalances'
import { useAppSelector } from '@/store'
import { selectOutgoingTransactions } from '@/store/txHistorySlice'
import { type ReactNode } from 'react'
import { Card, WidgetBody, WidgetContainer } from '@/components/dashboard/styled'
import { LinearProgress, List, ListItem, ListItemIcon, Typography } from '@mui/material'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'

const StatusItem = ({ children, completed = false }: { children: ReactNode; completed?: boolean }) => {
  return (
    <ListItem disableGutters>
      <ListItemIcon sx={{ minWidth: 24, mr: 1, color: (theme) => theme.palette.primary.main }}>
        {completed ? <CheckCircleRoundedIcon /> : <CircleOutlinedIcon />}
      </ListItemIcon>
      {children}
    </ListItem>
  )
}

type StatusProgressItems = Array<{
  name: string
  completed: boolean
}>

const StatusProgress = ({ items }: { items: StatusProgressItems }) => {
  const totalNumberOfItems = items.length
  const completedItems = items.filter((item) => item.completed)
  const progress = Math.ceil(completedItems.length / totalNumberOfItems) * 100

  return (
    <>
      <List disablePadding sx={{ py: 3 }}>
        {items.map(({ name, completed }) => {
          return (
            <StatusItem key={name} completed={completed}>
              {name}
            </StatusItem>
          )
        })}
      </List>
      <LinearProgress color="secondary" variant="determinate" value={progress} sx={{ borderRadius: 1 }} />
      <Typography variant="body2" mt={0.5}>
        {progress}% completed
      </Typography>
    </>
  )
}

const FirstSteps = () => {
  const { balances } = useBalances()
  const outgoingTransactions = useAppSelector(selectOutgoingTransactions)

  const hasNonZeroBalance = balances && (balances.items.length > 1 || BigInt(balances.items[0]?.balance || 0) > 0)
  const hasOutgoingTransactions = !!outgoingTransactions && outgoingTransactions.length > 0

  const items = [
    { name: 'Add funds', completed: hasNonZeroBalance },
    { name: 'Create your first transaction', completed: hasOutgoingTransactions },
    { name: 'Safe is ready', completed: hasNonZeroBalance && hasOutgoingTransactions },
  ]

  return (
    <WidgetContainer>
      <WidgetBody>
        <Card>
          <Typography variant="h4" fontWeight="bold">
            First steps
          </Typography>
          <StatusProgress items={items} />
        </Card>
      </WidgetBody>
    </WidgetContainer>
  )
}

export default FirstSteps
