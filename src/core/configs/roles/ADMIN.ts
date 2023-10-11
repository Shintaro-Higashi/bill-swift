import { cloneDeepWith } from 'lodash'
import BASE_ROLE from './BASE'
const ADMIN_ROLE = cloneDeepWith(BASE_ROLE)

// 管理者は全アクション許可
for (const prop in ADMIN_ROLE) {
  if (typeof ADMIN_ROLE[prop] === 'object') {
    for (const key in ADMIN_ROLE[prop]) {
      ADMIN_ROLE[prop][key] = true
    }
  }
}

// 管理者権限
export default ADMIN_ROLE
