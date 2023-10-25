import { AccountManage, HealthFacility, Patient, PatientFile, PatientRelateHealthFacility } from '@prisma/client'
import { CommonRelateUserModel } from '@/types/models/commonRelateUserModel'
import { PatientChangeHistoryModel } from '@/types/models/patientChangeHistory'
import { HealthFacilityModel } from '@/types'

// 患者Entity
export type PatientModel = Patient &
  CommonRelateUserModel & {
    healthFacility: HealthFacility | null
    accountManage: AccountManage | null
    patientChangeHistory: PatientChangeHistoryModel[] | null
    patientFile: PatientFile[] | null
    patientRelateHealthFacility: PatientRelateHealthFacility[] | null
  }

// 患者関連施設Entity
export type PatientRelateHealthFacilityModel = PatientRelateHealthFacility &
  CommonRelateUserModel & {
    healthFacility: HealthFacilityModel
  }
