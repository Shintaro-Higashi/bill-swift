import { Company, HealthFacilityCodeGroup } from '@prisma/client'
import { CommonRelateUserModel } from '@/types/models/commonRelateUserModel'

// 会社Entity
export type CompanyModel = Company & CommonRelateUserModel & { healthFacilityCodeGroup: HealthFacilityCodeGroup | null }
