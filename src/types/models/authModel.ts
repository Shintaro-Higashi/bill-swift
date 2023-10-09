// 認証後に返すユーザ情報
import { UserTypeKey } from '@/shared/items/userType'

export type LoginModel = {
  id: string
  name: string
  token: string
  userType: UserTypeKey
}
