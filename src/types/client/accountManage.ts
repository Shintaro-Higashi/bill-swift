import { AccountManageCreationRequest, AccountManageEditingRequest, AccountManageQueryRequest } from '@/types'

// 口座管理検索フォーム
export type AccountManageQueryForm = AccountManageQueryRequest & {}
// 口座管理作成フォーム
export type AccountManageCreationForm = AccountManageCreationRequest & {}
// 口座管理編集フォーム
export type AccountManageEditingForm = AccountManageEditingRequest & {}
