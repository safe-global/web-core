import { Box, SvgIcon, Typography } from '@mui/material'
import SafenetIcon from '@/public/images/safenet.svg'
import { type CSSProperties, type ReactNode } from 'react'

const GradientBoxSafenet = ({
  heading,
  children,
  className,
  style,
}: {
  heading?: string
  children?: ReactNode
  className?: string
  style?: CSSProperties
}) => {
  return (
    <Box
      className={className}
      style={{
        background: 'linear-gradient(90deg, #32f970 0%, #eed509 100%)',
        borderRadius: 'calc(var(--space-1) - 1px)',
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...style,
      }}
    >
      <Box
        style={{
          color: 'var(--color-static-main)',
          padding: 'calc(var(--space-1) / 2) var(--space-1)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SvgIcon component={SafenetIcon} inheritViewBox fontSize="small" />
        <Typography variant="h5" fontSize="small">
          {heading ?? 'Safenet'}
        </Typography>
      </Box>
      <Box
        className="GradientBoxSafenet-content"
        style={{
          background: 'var(--color-background-paper)',
          borderRadius: '0 0 var(--space-1) var(--space-1)',
          margin: '1px',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default GradientBoxSafenet
