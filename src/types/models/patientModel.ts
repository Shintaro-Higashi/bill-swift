import { AccountManage, HealthFacility, Patient, PatientFile, PatientRelateHealthFacility } from '@prisma/client'
import { CommonRelateUserModel } from '@/types/models/commonRelateUserModel'
import { PatientChangeHistoryModel } from '@/types/models/patientChangeHistory'

// 患者Entity
export type PatientModel = Patient &
  CommonRelateUserModel & {
    healthFacility: HealthFacility | null
    accountManage: AccountManage | null
    patientChangeHistory: PatientChangeHistoryModel[] | null
    patientFile: PatientFile[] | null
    patientRelateHealthFacility: PatientRelateHealthFacility[] | null
  }
