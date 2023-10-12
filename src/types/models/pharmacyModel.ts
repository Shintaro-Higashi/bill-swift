import { AccountManage, Company, Pharmacy, PharmacyGroup } from '@prisma/client'
import { CommonRelateUserModel } from '@/types/models/commonRelateUserModel'

// 店舗Entity
export type PharmacyModel = Pharmacy &
  CommonRelateUserModel & {
    company: Company | null
    pharmacyGroup: PharmacyGroup | null
    withdrawalAccountManage: AccountManage | null
    transferAccountManage: AccountManage | null
  }
