import { ReactElement, SyntheticEvent, useCallback, useEffect } from 'react'
import groupBy from 'lodash/groupBy'
import { useAppDispatch, useAppSelector } from '@/store'
import { closeNotification, Notification, selectNotifications } from '@/store/notificationsSlice'
import { Alert, AlertColor, Link, Snackbar, SnackbarCloseReason } from '@mui/material'
import css from './styles.module.css'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const toastStyle = { position: 'static', margin: 1 }

const Toast = ({
  message,
  variant,
  link,
  onClose,
}: {
  message: string
  variant: AlertColor
  link?: Notification['link']
  onClose: () => void
}) => {
  const router = useRouter()

  const handleClose = (_: Event | SyntheticEvent, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return
    onClose()
  }

  return (
    <Snackbar open onClose={handleClose} sx={toastStyle} autoHideDuration={5000}>
      <Alert severity={variant} onClose={handleClose} elevation={3} sx={{ width: '340px' }}>
        {message}
        {link && (
          <NextLink href={{ href: link.href, query: router.query }} passHref>
            <Link className={css.link}>
              {link.title} <ChevronRightIcon />
            </Link>
          </NextLink>
        )}
      </Alert>
    </Snackbar>
  )
}

const getVisibleNotifications = (notifications: Notification[]) => {
  return notifications.filter((notification) => !notification.isDismissed)
}

const Notifications = (): ReactElement | null => {
  const notifications = useAppSelector(selectNotifications)
  const dispatch = useAppDispatch()

  const visible = getVisibleNotifications(notifications)

  const handleClose = useCallback(
    (item: Notification) => {
      dispatch(closeNotification(item))
    },
    [dispatch],
  )

  // Close previous notifications in the same group
  useEffect(() => {
    const groups: Record<string, Notification[]> = groupBy(notifications, 'groupKey')

    Object.values(groups).forEach((items) => {
      const previous = getVisibleNotifications(items).slice(0, -1)
      previous.forEach(handleClose)
    })
  }, [notifications, handleClose])

  if (!visible.length) {
    return null
  }

  return (
    <div className={css.container}>
      {visible.map((item) => (
        <div className={css.row} key={item.id}>
          <Toast {...item} onClose={() => handleClose(item)} />
        </div>
      ))}
    </div>
  )
}

export default Notifications
