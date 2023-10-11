import { AccessControlProvider, CanParams } from '@refinedev/core'
import { authProvider } from '@/core/providers/authProvider'
import { LoginModel } from '@/types/models/authModel'
import { toRoleAction } from '@/core/configs/roles/BASE'

/**
 * アクセス権限を制御するためのProvider定義です。
 */
export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }: CanParams) => {
    if (!authProvider.getIdentity) return { can: false }
    const loginUser = (await authProvider.getIdentity()) as LoginModel
    if (!loginUser) return { can: false }
    const role = await import(`@/core/configs/roles/${loginUser.userType}`)
    const roleConfig = role.default
    const roleAction = toRoleAction(action)
    const hasRole = roleConfig[resource ?? ''] && roleConfig[resource ?? ''][roleAction] === true
    // console.log('アクセス権', resource, action, roleAction, hasRole)
    return { can: hasRole }
  },
  options: {
    buttons: {
      enableAccessControl: true,
      // 権限がない場合ボタンを非表示にするか,disabledにするか
      hideIfUnauthorized: false,
    },
  },
}
