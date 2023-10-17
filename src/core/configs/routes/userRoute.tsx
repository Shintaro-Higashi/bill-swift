import parentAdminRoute from '@/core/configs/routes/settingGroupRoute'
import healthFacilitiesRoute from '@/core/configs/routes/healthFacilitiesRoute'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { ResourceProps } from '@refinedev/core'

const name = 'users'
const order = healthFacilitiesRoute.meta?.order + 1
/**
 * ユーザ管理リソース情報です
 */
const ROUTE: ResourceProps = {
  name,
  list: `/${name}`,
  create: `/${name}/create`,
  edit: `/${name}/edit/:id`,
  show: `/${name}/show/:id`,
  meta: {
    parent: parentAdminRoute.name,
    order,
    icon: <AccountCircleIcon />,
    canDelete: true,
  },
}
export default ROUTE
