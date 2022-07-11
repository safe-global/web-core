import EthHashInfo from '@/components/common/EthHashInfo'
import useSafeInfo from '@/hooks/useSafeInfo'
import { Paper, Grid, Typography, Box, Link } from '@mui/material'

const NoModules = () => {
  return (
    <Typography mt={2} color={(theme) => theme.palette.secondary.light}>
      No modules set
    </Typography>
  )
}

const ModuleDisplay = ({ moduleAddress, chainId }: { moduleAddress: string; chainId: string }) => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.primary.background,
        border: `1px solid ${theme.palette.primary.main}`,
        padding: 1,
        borderRadius: '4px',
        marginTop: 2,
      })}
    >
      <EthHashInfo shortAddress={false} address={moduleAddress} showCopyButton chainId={chainId} showAvatar={false} />
    </Box>
  )
}

const SafeModules = () => {
  const { safe } = useSafeInfo()
  return (
    <Paper elevation={0} sx={{ padding: 4 }}>
      <Grid container direction="row" justifyContent="space-between">
        <Grid item>
          <Typography variant="h4" fontWeight={700}>
            Safe modules
          </Typography>
        </Grid>
        <Grid item sm={12} md={8}>
          <Box>
            <Typography>
              Modules allow you to customize the access-control logic of your Safe. Modules are potentially risky, so
              make sure to only use modules from trusted sources. Learn more about modules{' '}
              <Link href="https://docs.gnosis-safe.io/contracts/modules-1" rel="noreferrer noopener" target="_blank">
                here
              </Link>
            </Typography>
            {(safe?.modules || []).length === 0 ? (
              <NoModules />
            ) : (
              safe?.modules?.map((module) => (
                <ModuleDisplay key={module.value} chainId={safe.chainId} moduleAddress={module.value} />
              ))
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default SafeModules
