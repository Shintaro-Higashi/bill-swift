import { AccountManage, HealthFacility, HealthFacilityRelatePharmacy, Pharmacy, PharmacyGroup } from '@prisma/client'
import { CommonRelateUserModel } from '@/types/models/commonRelateUserModel'

// 施設Entity
export type HealthFacilityModel = HealthFacility &
  CommonRelateUserModel & {
    pharmacy: (Pharmacy & { pharmacyGroup: PharmacyGroup | null }) | null
    healthFacilityRelatePharmacy: HealthFacilityRelatePharmacy[] | null
    accountManage: AccountManage | null
  }
