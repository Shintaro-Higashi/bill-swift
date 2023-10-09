import { User } from '@prisma/client'
import { CommonRelateUserModel } from '@/types/models/commonRelateUserModel'

// ユーザEntity
export type UserModel = User & CommonRelateUserModel & {}
