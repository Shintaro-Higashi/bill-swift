import { HealthFacilityRelatePharmacy } from '@prisma/client'
import { CommonRelateUserModel } from '@/types/models/commonRelateUserModel'

// 施設関連薬局Entity
export type HealthFacilityRelatePharmacyModel = HealthFacilityRelatePharmacy & CommonRelateUserModel & {}
