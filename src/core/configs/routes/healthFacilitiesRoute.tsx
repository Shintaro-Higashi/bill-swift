import pharmacyRoute from '@/core/configs/routes/pharmacyRoute'
import settingGroupRoute from '@/core/configs/routes/settingGroupRoute'
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork'
import { ResourceProps } from '@refinedev/core'

const name = 'healthFacilities'
const order = pharmacyRoute.meta?.order + 1
/**
 * 施設管理リソース情報です
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
    icon: <MapsHomeWorkIcon />,
    canDelete: true,
  },
}
export default ROUTE
