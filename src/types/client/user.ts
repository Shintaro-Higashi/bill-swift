import { UserCreationRequest, UserEditingRequest, UserQueryRequest } from '@/types'

// 会社検索フォーム
export type UserQueryForm = UserQueryRequest & {}
// 会社作成フォーム
export type UserCreationForm = UserCreationRequest & {}
// 会社編集フォーム
export type UserEditingForm = UserEditingRequest & {}
