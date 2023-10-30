import { cloneDeepWith } from 'lodash'
import BASE_ROLE from './BASE'
const PHARMACY_ROLE = cloneDeepWith(BASE_ROLE)

const ROLE = {
  ...PHARMACY_ROLE,
  companies: {
    ...PHARMACY_ROLE.companies,
    create: false,
    edit: false,
    // 所属施設の変更
    'change-health-facilities': false,
  },
}

// 店舗権限
export default ROLE
