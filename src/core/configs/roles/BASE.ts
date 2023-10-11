/**
 * ベースとなるロール定義情報です。
 * <pre>
 *  どのロールでもアクセス権が必要なactionのみtrueにしています。
 * </pre>
 */
const BASE_ROLE = {
  // 会社
  companies: {
    read: true,
    create: false,
    edit: false,
    archive: false,
  },
  // 店舗
  pharmacies: {
    read: true,
    create: false,
    edit: false,
    archive: false,
  },
  // 施設
  healthFacilities: {
    read: true,
    create: true,
    edit: true,
    editPharmacy: false,
    archive: true,
  },
  // 患者
  patients: {
    read: true,
    create: true,
    edit: true,
    archive: true,
  },
  // ユーザ
  users: {
    read: true,
    create: false,
    edit: false,
    archive: false,
  },
  // 設定(メニュー用)
  settinggroups: {
    read: true,
  },
} as any
export default BASE_ROLE

const resourceActionToRole = {
  list: 'read',
  show: 'read',
  create: 'create',
  edit: 'edit',
  delete: 'archive',
} as any

/**
 * 画面上のaction名をrole上のaction名に変換します。
 * @param frontAction 画面上のaction名
 */
export const toRoleAction = (frontAction: string) => {
  return resourceActionToRole[frontAction] ?? ''
}
