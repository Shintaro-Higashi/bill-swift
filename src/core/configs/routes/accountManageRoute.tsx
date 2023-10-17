import settingGroupRoute from '@/core/configs/routes/settingGroupRoute'
import companyRoute from '@/core/configs/routes/companyRoute'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { ResourceProps } from '@refinedev/core'

const name = 'accountManages'
const order = companyRoute.meta?.order + 1
/**
 * 会社管理リソース情報です
 */
const ROUTE: ResourceProps = {
  name,
  list: `/${name}`,
  create: `/${name}/create`,
  edit: `/${name}/edit/:id`,
  show: `/${name}/show/:id`,
  meta: {
    parent: settingGroupRoute.name,
    order,
    icon: <AccountBalanceIcon />,
    canDelete: true,
  },
}
export default ROUTE
