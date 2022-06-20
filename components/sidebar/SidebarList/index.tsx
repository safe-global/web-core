import type { ReactElement } from 'react'
import List, { type ListProps } from '@mui/material/List'
import ListItemButton, { type ListItemButtonProps } from '@mui/material/ListItemButton'
import ListItemIcon, { type ListItemIconProps } from '@mui/material/ListItemIcon'
import ListItemText, { type ListItemTextProps } from '@mui/material/ListItemText'
import { useRouter } from 'next/router'
import { type LinkProps } from 'next/link'

import css from './styles.module.css'

export const SidebarList = ({ children, ...rest }: Omit<ListProps, 'className'>): ReactElement => (
  <List component="nav" className={css.list} {...rest}>
    {children}
  </List>
)

export const SidebarListItemButton = ({
  href,
  children,
  ...rest
}: Omit<ListItemButtonProps, 'sx'> & { href: LinkProps['href'] }): ReactElement => {
  const router = useRouter()
  return (
    <ListItemButton
      onClick={() => router.push(href)}
      sx={({ palette }) => ({
        borderRadius: '6px',
        '&.MuiListItemButton-root:hover, &.MuiListItemButton-root.Mui-selected': {
          backgroundColor: `${palette.primaryGreen[200]} !important`,
          img: {
            filter: rest.selected
              ? // #008C73 - palette.primary[400]
                'invert(30%) sepia(41%) saturate(4854%) hue-rotate(155deg) brightness(92%) contrast(102%)'
              : undefined,
          },
        },
      })}
      {...rest}
    >
      {children}
    </ListItemButton>
  )
}

export const SidebarListItemIcon = ({ children, ...rest }: Omit<ListItemIconProps, 'className'>): ReactElement => (
  <ListItemIcon className={css.icon} {...rest}>
    {children}
  </ListItemIcon>
)

export const SidebarListItemText = ({
  children,
  bold = false,
  ...rest
}: ListItemTextProps & { bold?: boolean }): ReactElement => (
  <ListItemText primaryTypographyProps={{ variant: 'body2', fontWeight: bold ? 700 : undefined }} {...rest}>
    {children}
  </ListItemText>
)
