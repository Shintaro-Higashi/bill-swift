import ContactsIcon from '@mui/icons-material/Contacts'
import { ResourceProps } from '@refinedev/core'
import billRoute from '@/core/configs/routes/billRoute'

const name = 'patients'
const order = (billRoute.meta?.order || 1) + 1
/**
 * 患者管理リソース情報です
 */
const ROUTE: ResourceProps = {
  name,
  list: `/${name}`,
  create: `/${name}/create`,
  edit: `/${name}/edit/:id`,
  show: `/${name}/show/:id`,
  meta: {
    order,
    icon: <ContactsIcon />,
    canDelete: true,
  },
}
export default ROUTE
