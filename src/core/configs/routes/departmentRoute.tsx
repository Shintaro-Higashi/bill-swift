import settingGroupRoute from '@/core/configs/routes/settingGroupRoute'
import PeopleIcon from '@mui/icons-material/People'
import { ResourceProps } from '@refinedev/core'

const name = 'department'
/**
 * 部署管理リソース情報です
 */
const ROUTE: ResourceProps = {
  name,
  list: `/${name}`,
  create: `/${name}/create`,
  edit: `/${name}/edit/:id`,
  show: `/${name}/show/:id`,
  meta: {
    parent: settingGroupRoute.name,
    order: 5,
    icon: <PeopleIcon />,
    canDelete: true,
    hide: true,
  },
}
export default ROUTE
