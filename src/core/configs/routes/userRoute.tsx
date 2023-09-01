import parentAdminRoute from '@/core/configs/routes/settingGroupRoute'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { ResourceProps } from '@refinedev/core'
import pharmacyRoute from '@/core/configs/routes/pharmacyRoute'

const name = 'users'
const order = pharmacyRoute.meta?.order
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
