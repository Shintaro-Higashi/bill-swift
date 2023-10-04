import { PharmacyGroup } from '@prisma/client'
import { CommonRelateUserModel } from '@/types/models/commonRelateUserModel'

// 薬局Entity
export type PharmacyGroupModel = PharmacyGroup & CommonRelateUserModel & {}
