import { HealthFacilityCodeGroup } from '@prisma/client'
import { CommonRelateUserModel } from '@/types/models/commonRelateUserModel'

// 施設コードグループEntity
export type HealthFacilityCodeGroupModel = HealthFacilityCodeGroup & CommonRelateUserModel & {}
