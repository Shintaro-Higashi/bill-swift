import { HealthFacilityCodeManage } from '@prisma/client'
import { CommonRelateUserModel } from '@/types/models/commonRelateUserModel'
import { HealthFacilityCodeGroupModel } from '@/types'

// 施設コード管理Entity
export type HealthFacilityCodeManageModel = HealthFacilityCodeManage &
  CommonRelateUserModel & {
    healthFacilityCodeGroup: HealthFacilityCodeGroupModel | null
  }
