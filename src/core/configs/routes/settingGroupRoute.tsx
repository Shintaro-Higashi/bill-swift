import { ResourceProps } from '@refinedev/core'
import patientRoute from '@/core/configs/routes/patientRoute'
import SettingsIcon from '@mui/icons-material/Settings'

const name = 'settingGroups'
const order = (patientRoute.meta?.order || 1) + 1
/**
 * 設定系のリソース情報をグループ化するためのリソース定義です。
 */
const ROUTE: ResourceProps = {
  name,
  meta: {
    icon: <SettingsIcon />,
    order: order,
  },
}
export default ROUTE
