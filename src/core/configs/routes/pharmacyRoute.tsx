import settingGroupRoute from '@/core/configs/routes/settingGroupRoute'
import StoreIcon from '@mui/icons-material/Store'
import { ResourceProps } from '@refinedev/core'
import companyRoute from '@/core/configs/routes/companyRoute'

const name = 'pharmacies'
const order = companyRoute.meta?.order + 1
/**
 * 薬局管理リソース情報です
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
    icon: <StoreIcon />,
    canDelete: true,
  },
}
export default ROUTE
