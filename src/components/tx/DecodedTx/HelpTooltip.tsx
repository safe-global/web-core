import { Tooltip, SvgIcon } from '@mui/material'
import InfoIcon from '@/public/images/notifications/info.svg'
import ExternalLink from '@/components/common/ExternalLink'
import { HelpCenterArticle } from '@/config/constants'

const HelpToolTip = () => (
  <Tooltip
    title={
      <>
        Learn more about{' '}
        <ExternalLink href={HelpCenterArticle.ADVANCED_PARAMS} title="Learn more about advanced details">
          advanced details
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
          mt: '-1px',
        }}
      />
    </span>
  </Tooltip>
)

export default HelpToolTip
