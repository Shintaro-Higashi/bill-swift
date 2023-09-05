import { Company } from '@prisma/client'
import { CommonRelateUserModel } from '@/types/models/commonRelateUserModel'

// 会社EntityModel
export type CompanyModel = Company & CommonRelateUserModel & {}
