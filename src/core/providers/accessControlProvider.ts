import { AccessControlProvider, CanParams } from '@refinedev/core'

/**
 * アクセス権限を制御するためのProvider定義です。
 */
export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }: CanParams) => {
    // if (resource === 'companies' && action === 'delete') {
    //   return { can: false, reason: '削除権限がない' }
    // }
    return { can: true }
  },
  options: {
    buttons: {
      enableAccessControl: true,
      // 権限がない場合ボタンを非表示にするか,disabledにするか
      hideIfUnauthorized: false,
    },
  },
}
