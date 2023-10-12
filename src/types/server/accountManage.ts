import { AccountManageCreationRequest, AccountManageQueryRequest } from '@/types'

// 口座管理検索Dto
export type AccountManageQueryDto = AccountManageQueryRequest & {}
// 口座管理作成Dto
export type AccountManageCreationDto = AccountManageCreationRequest & {}
// 口座管理編集Dto
export type AccountManageEditingDto = AccountManageCreationRequest & {}
