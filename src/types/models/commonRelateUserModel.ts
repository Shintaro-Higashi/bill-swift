import { User } from '@prisma/client'

// 全テーブル共通の作成者、更新者参照モデル
export type CommonRelateUserModel = {
  createdUser?: User | null
  updatedUser?: User | null
}
