import darkPalette from '@/components/theme/darkPalette'
import lightPalette from '@/components/theme/lightPalette'
import SafenetLogo from '@/public/images/logo-safenet.svg'
import { Box, Button, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import css from './styles.module.css'

export const SafenetHeader = () => {
  const { palette } = useTheme()

  return (
    <Grid className={palette.mode === 'dark' ? css.darkBanner : css.lightBanner}>
      <Box className={css.title}>
        <Typography variant="h1" sx={{
          fontSize: 40,
          color: darkPalette.text.primary
        }}>
          UPDAGRADE TO
        </Typography>
        <SafenetLogo />
      </Box>
      <Typography color={darkPalette.text.primary}>
        Supercharge your finances by enjoying a unified experience across networks while keeping the main treasury secured.
      </Typography>
      <Button className={css.bannerButton} sx={{
        color: lightPalette.text.primary
      }}>
        Learn more
      </Button>
    </Grid>
  )
}
