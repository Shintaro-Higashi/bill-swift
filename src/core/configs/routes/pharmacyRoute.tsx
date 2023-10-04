import settingGroupRoute from '@/core/configs/routes/settingGroupRoute'
import StoreIcon from '@mui/icons-material/Store'
import { ResourceProps } from '@refinedev/core'

const name = 'pharmacies'
const order = settingGroupRoute.meta?.order + 1
/**
 * 店舗管理リソース情報です
 */
const ROUTE: ResourceProps = {
  name,
  list: `/${name}`,
  create: `/${name}/create`,
  edit: `/${name}/edit/:id`,
  show: `/${name}/show/:id`,
  clone: `/${name}/create/:id`,
  meta: {
    parent: settingGroupRoute.name,
    order,
    icon: <StoreIcon />,
    canDelete: true,
  },
}
export default ROUTE
