import { UserCreationRequest, UserQueryRequest } from '@/types'

// ユーザ検索Dto
export type UserQueryDto = UserQueryRequest & {}
// ユーザ作成Dto
export type UserCreationDto = UserCreationRequest & {}
// ユーザ編集Dto
export type UserEditingDto = UserCreationRequest & {}
