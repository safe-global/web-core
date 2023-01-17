import Link from 'next/link'
import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { resolveHref } from 'next/dist/shared/lib/router/router'
import type { ReactNode, SyntheticEvent } from 'react'
import type { SafeAppData } from '@safe-global/safe-gateway-typescript-sdk'
import type { NextRouter } from 'next/router'
import type { UrlObject } from 'url'

import SafeAppIconCard from '@/components/new-safe-apps/SafeAppIconCard/SafeAppIconCard'
import { AppRoutes } from '@/config/routes'
import SafeAppActionButtons from '../SafeAppActionButtons/SafeAppActionButtons'
import SafeAppTags from '../SafeAppTags/SafeAppTags'
import css from './styles.module.css'

export type SafeAppsViewMode = 'list-view' | 'grid-view'

export const GRID_VIEW_MODE: SafeAppsViewMode = 'grid-view' // default view
export const LIST_VIEW_MODE: SafeAppsViewMode = 'list-view'

type SafeAppCardProps = {
  safeApp: SafeAppData
  onClickSafeApp?: () => void
  viewMode?: SafeAppsViewMode
  isBookmarked?: boolean
  onBookmarkSafeApp?: (safeAppId: number) => void
  removeCustomApp?: (safeApp: SafeAppData) => void
}

const SafeAppCard = ({
  safeApp,
  onClickSafeApp,
  viewMode,
  isBookmarked,
  onBookmarkSafeApp,
  removeCustomApp,
}: SafeAppCardProps) => {
  const router = useRouter()

  const safeAppUrl = getSafeAppUrl(router, safeApp.url)

  const isListViewMode = viewMode === LIST_VIEW_MODE

  if (isListViewMode) {
    return (
      <SafeAppCardListView
        safeApp={safeApp}
        safeAppUrl={safeAppUrl}
        isBookmarked={isBookmarked}
        onBookmarkSafeApp={onBookmarkSafeApp}
        removeCustomApp={removeCustomApp}
        onClickSafeApp={onClickSafeApp}
      />
    )
  }

  // Grid view as fallback
  return (
    <SafeAppCardGridView
      safeApp={safeApp}
      safeAppUrl={safeAppUrl}
      isBookmarked={isBookmarked}
      onBookmarkSafeApp={onBookmarkSafeApp}
      removeCustomApp={removeCustomApp}
      onClickSafeApp={onClickSafeApp}
    />
  )
}

export default SafeAppCard

// TODO: move to utils ??
export const getSafeAppUrl = (router: NextRouter, safeAppUrl: string) => {
  const shareUrlObj: UrlObject = {
    pathname: AppRoutes.apps.index,
    query: { safe: router.query.safe, appUrl: safeAppUrl },
  }

  return resolveHref(router, shareUrlObj)
}

type SafeAppCardViewProps = {
  safeApp: SafeAppData
  onClickSafeApp?: () => void
  safeAppUrl: string
  isBookmarked?: boolean
  onBookmarkSafeApp?: (safeAppId: number) => void
  removeCustomApp?: (safeApp: SafeAppData) => void
}

const SafeAppCardGridView = ({
  safeApp,
  onClickSafeApp,
  safeAppUrl,
  isBookmarked,
  onBookmarkSafeApp,
  removeCustomApp,
}: SafeAppCardViewProps) => {
  return (
    <SafeAppCardContainer safeAppUrl={safeAppUrl} onClickSafeApp={onClickSafeApp}>
      {/* Safe App Header */}
      <CardHeader
        className={css.safeAppHeader}
        avatar={<SafeAppIconCard src={safeApp.iconUrl} alt={`${safeApp.name} logo`} />}
        action={
          <>
            {/* Safe App Action Buttons */}
            <SafeAppActionButtons
              safeApp={safeApp}
              isBookmarked={isBookmarked}
              onBookmarkSafeApp={onBookmarkSafeApp}
              removeCustomApp={removeCustomApp}
            />
          </>
        }
      />

      <CardContent className={css.safeAppContent}>
        {/* Safe App Title */}
        <Typography className={css.safeAppTitle} gutterBottom variant="h5">
          {safeApp.name}
        </Typography>

        {/* Safe App Description */}
        <Typography className={css.safeAppDescription} variant="body2" color="text.secondary">
          {safeApp.description}
        </Typography>

        {/* Safe App Tags */}
        <SafeAppTags tags={safeApp.tags} />
      </CardContent>
    </SafeAppCardContainer>
  )
}

const SafeAppCardListView = ({
  safeApp,
  onClickSafeApp,
  safeAppUrl,
  isBookmarked,
  onBookmarkSafeApp,
  removeCustomApp,
}: SafeAppCardViewProps) => {
  return (
    <SafeAppCardContainer safeAppUrl={safeAppUrl} onClickSafeApp={onClickSafeApp}>
      {/* Safe App Header */}
      <CardHeader
        avatar={
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            <SafeAppIconCard src={safeApp.iconUrl} alt={`${safeApp.name} logo`} />

            {/* Safe App Title */}
            <Typography className={css.safeAppTitle} gutterBottom variant="h5">
              {safeApp.name}
            </Typography>
          </Box>
        }
        sx={{
          '& > .MuiCardHeader-action': {
            alignSelf: 'center',
          },
        }}
        action={
          <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
            {/* Safe App Action Buttons */}
            <SafeAppActionButtons
              safeApp={safeApp}
              isBookmarked={isBookmarked}
              onBookmarkSafeApp={onBookmarkSafeApp}
              removeCustomApp={removeCustomApp}
            />
          </Box>
        }
      />
    </SafeAppCardContainer>
  )
}

type SafeAppCardContainerProps = {
  onClickSafeApp?: () => void
  safeAppUrl: string
  children: ReactNode
}

export const SafeAppCardContainer = ({ children, safeAppUrl, onClickSafeApp }: SafeAppCardContainerProps) => {
  const handleClickSafeApp = (event: SyntheticEvent) => {
    if (onClickSafeApp) {
      event.preventDefault()
      onClickSafeApp()
    }
  }

  return (
    <Link href={safeAppUrl} passHref>
      <a rel="noreferrer" onClick={handleClickSafeApp}>
        <Card className={css.safeAppContainer}>{children}</Card>
      </a>
    </Link>
  )
}
