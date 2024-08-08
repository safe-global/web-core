import { type ReactNode } from 'react'
import { Grid, Typography } from '@mui/material'

const minWidth = { xl: '25%', lg: '2vw' }

const FieldsGrid = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <Grid container alignItems="center" gap={1} wrap="nowrap">
      <Grid item minWidth={minWidth}>
        <Typography color="primary.light" noWrap>
          {title}
        </Typography>
      </Grid>

      <Grid item xs>
        {children}
      </Grid>
    </Grid>
  )
}

export default FieldsGrid
