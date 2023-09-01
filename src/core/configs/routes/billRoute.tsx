import DescriptionIcon from '@mui/icons-material/Description'
import { ResourceProps } from '@refinedev/core'

const name = 'bill'
/**
 * 請求リソース情報です
 */
const ROUTE: ResourceProps = {
  name,
  list: `/${name}`,
  create: `/${name}/create`,
  edit: `/${name}/edit/:id`,
  show: `/${name}/show/:id`,
  meta: {
    order: 1,
    icon: <DescriptionIcon />,
    canDelete: true,
    hide: true,
    disabled: true, //実装前
  },
}
export default ROUTE
