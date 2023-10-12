import { AccountManage } from '@prisma/client'
import { CommonRelateUserModel } from '@/types/models/commonRelateUserModel'

// 口座管理Entity
export type AccountManageModel = AccountManage & CommonRelateUserModel & {}
