import { HealthFacilityCodeManage } from '@prisma/client'
import { CommonRelateUserModel } from '@/types/models/commonRelateUserModel'

// 施設コード管理Entity
export type HealthFacilityCodeManageModel = HealthFacilityCodeManage & CommonRelateUserModel & {}
