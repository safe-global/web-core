import { useContext, useEffect, useRef } from 'react'
import { mapRedefineSeverity } from '@/components/tx/security/redefine/useRedefine'
import { TxSecurityContext } from '@/components/tx/security/shared/TxSecurityContext'
import { SecuritySeverity } from '@/services/security/modules/types'
import groupBy from 'lodash/groupBy'
import { Alert, Box, Checkbox, FormControlLabel, Paper, SvgIcon, Tooltip, Typography } from '@mui/material'
import ExternalLink from '@/components/common/ExternalLink'
import { FEATURES } from '@/utils/chains'
import { useHasFeature } from '@/hooks/useChains'
import { ErrorBoundary } from '@sentry/react'
import { REDEFINE_ARTICLE, REDEFINE_SIMULATION_URL } from '@/config/constants'
import css from 'src/components/tx/security/redefine/styles.module.css'
import sharedCss from '@/components/tx/security/shared/styles.module.css'
import RedefineLogoDark from '@/public/images/transactions/redefine-dark-mode.png'
import RedefineLogo from '@/public/images/transactions/redefine.png'
import Track from '@/components/common/Track'
import { MODALS_EVENTS } from '@/services/analytics'
import { useDarkMode } from '@/hooks/useDarkMode'
import CircularProgress from '@mui/material/CircularProgress'
import { RedefineHint } from '@/components/tx/security/redefine/RedefineHint'
import InfoIcon from '@/public/images/notifications/info.svg'
import Image from 'next/image'
import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'

const MAX_SHOWN_WARNINGS = 3

const RedefineBlock = () => {
  const { severity, isLoading, error, needsRiskConfirmation, isRiskConfirmed, setIsRiskConfirmed, isRiskIgnored } =
    useContext(TxSecurityContext)

  const { safeTx } = useContext(SafeTxContext)

  // We either scan a tx or a message if tx is undefined
  const isTransaction = !!safeTx
  const checkboxRef = useRef<HTMLElement>(null)

  const isDarkMode = useDarkMode()
  const severityProps = severity !== undefined ? mapRedefineSeverity[severity] : undefined

  const toggleConfirmation = () => {
    setIsRiskConfirmed((prev) => !prev)
  }

  // Highlight checkbox if user tries to submit transaction without confirming risks
  useEffect(() => {
    if (isRiskIgnored) {
      checkboxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [isRiskIgnored, checkboxRef])

  if (!severityProps && !isLoading && !error) {
    return null
  }

  return (
    <div className={css.wrapperBox}>
      <Paper
        variant="outlined"
        className={sharedCss.wrapper}
        sx={needsRiskConfirmation ? { borderTop: 'none', borderLeft: 'none', borderRight: 'none' } : { border: 'none' }}
      >
        <div>
          <Typography variant="body2" fontWeight={700} sx={{ position: 'relative', zIndex: 1 }}>
            Scan for risks
            <Tooltip
              title={
                <>
                  This {isTransaction ? 'transaction' : 'message'} has been automatically scanned for risks to help
                  prevent scams.&nbsp;
                  <ExternalLink href={REDEFINE_ARTICLE} title="Learn more about security scans">
                    Learn more about security scans
                  </ExternalLink>
                  .
                </>
              }
              arrow
              placement="top"
            >
              <span>
                <SvgIcon
                  component={InfoIcon}
                  inheritViewBox
                  color="border"
                  fontSize="small"
                  sx={{
                    verticalAlign: 'middle',
                    ml: 0.5,
                  }}
                />
              </span>
            </Tooltip>
          </Typography>

          <Typography variant="caption" className={sharedCss.poweredBy} position="relative">
            Powered by{' '}
            <div className={css.redefine}>
              <Image src={isDarkMode ? RedefineLogoDark : RedefineLogo} alt="Redefine logo" width={52} />
            </div>
          </Typography>
        </div>

        <div className={sharedCss.result}>
          {isLoading ? (
            <CircularProgress
              size={22}
              sx={{
                color: ({ palette }) => palette.text.secondary,
              }}
            />
          ) : severityProps ? (
            <Typography variant="body2" color={`${severityProps.color}.main`} className={sharedCss.result}>
              <SvgIcon
                component={severityProps.icon}
                inheritViewBox
                fontSize="small"
                sx={{ verticalAlign: 'middle', mr: 1 }}
              />
              {severityProps.label}
            </Typography>
          ) : error ? (
            <Typography variant="body2" color="error" className={sharedCss.result}>
              {error.message}
            </Typography>
          ) : null}
        </div>
      </Paper>
      <div>
        {needsRiskConfirmation && (
          <Box pl={2} ref={checkboxRef}>
            <Track {...MODALS_EVENTS.ACCEPT_RISK}>
              <FormControlLabel
                label={`I understand the risks and would like to sign this ${
                  isTransaction ? 'transaction' : 'message'
                }`}
                control={<Checkbox checked={isRiskConfirmed} onChange={toggleConfirmation} />}
                className={isRiskIgnored ? css.checkboxError : ''}
              />
            </Track>
          </Box>
        )}
      </div>
    </div>
  )
}

export const Redefine = () => {
  const isFeatureEnabled = useHasFeature(FEATURES.RISK_MITIGATION)

  if (!isFeatureEnabled) {
    return null
  }

  return (
    <ErrorBoundary fallback={<div>Error showing scan result</div>}>
      <RedefineBlock />
    </ErrorBoundary>
  )
}

export const RedefineMessage = () => {
  const { severity, warnings, simulationUuid } = useContext(TxSecurityContext)

  /* Evaluate security warnings */
  const relevantWarnings = warnings.filter((warning) => warning.severity !== SecuritySeverity.NONE)
  const shownWarnings = relevantWarnings.slice(0, MAX_SHOWN_WARNINGS)
  const hiddenWarningCount = warnings.length - shownWarnings.length
  const hiddenMaxSeverity =
    hiddenWarningCount > 0 ? relevantWarnings[MAX_SHOWN_WARNINGS]?.severity : SecuritySeverity.NONE

  const groupedShownWarnings = groupBy(shownWarnings, (warning) => warning.severity)
  const sortedSeverities = Object.keys(groupedShownWarnings).sort((a, b) => (Number(a) < Number(b) ? 1 : -1))

  if (sortedSeverities.length === 0 && hiddenWarningCount === 0 && !simulationUuid) return null

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {sortedSeverities.map((key) => (
        <RedefineHint
          key={key}
          severity={Number(key)}
          warnings={groupedShownWarnings[key].map((warning) => warning.description.short)}
        />
      ))}

      {hiddenWarningCount > 0 && (
        <RedefineHint
          severity={hiddenMaxSeverity}
          warnings={[`${hiddenWarningCount} more issue${hiddenWarningCount > 1 ? 's' : ''}`]}
        />
      )}

      {simulationUuid && (
        <Alert severity="info" sx={{ border: 'unset' }}>
          {severity === SecuritySeverity.NONE && (
            <Typography variant="body2" fontWeight={700}>
              {mapRedefineSeverity[severity].label}
            </Typography>
          )}
          For a comprehensive risk overview,{' '}
          <ExternalLink href={`${REDEFINE_SIMULATION_URL}${simulationUuid}`}>
            see the full report on Redefine
          </ExternalLink>
        </Alert>
      )}
    </Box>
  )
}
