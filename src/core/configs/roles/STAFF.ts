import { cloneDeepWith } from 'lodash'
import BASE_ROLE from './BASE'
const STAFF_ROLE = cloneDeepWith(BASE_ROLE)

const ROLE = {
  ...STAFF_ROLE,
  companies: {
    ...STAFF_ROLE.companies,
    create: true,
    edit: true,
    archive: true,
  },
  pharmacy: {
    ...STAFF_ROLE.pharmacy,
    create: true,
    edit: true,
    archive: true,
  },
  healthFacilities: {
    ...STAFF_ROLE.healthFacilities,
    editPharmacy: true,
  },
}

// 業務課権限
export default ROLE
