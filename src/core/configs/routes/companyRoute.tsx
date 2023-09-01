import settingGroupRoute from '@/core/configs/routes/settingGroupRoute'
import BusinessIcon from '@mui/icons-material/Business'
import { ResourceProps } from '@refinedev/core'

const name = 'companies'
const order = settingGroupRoute.meta?.order + 1
/**
 * 会社管理リソース情報です
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
    icon: <BusinessIcon />,
    canDelete: true,
  },
}
export default ROUTE
