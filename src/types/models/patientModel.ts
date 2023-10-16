import {
  Patient,
  HealthFacility,
  PatientCodeHistory,
  PatientFile,
  PatientChangeHistory,
  PatientRelateHealthFacility,
} from '@prisma/client'
import { CommonRelateUserModel } from '@/types/models/commonRelateUserModel'

// 患者Entity
export type PatientModel = Patient &
  CommonRelateUserModel & {
    healthFacility: HealthFacility | null
    patientChangeHistory: PatientChangeHistory[] | null
    patientCodeHistory: PatientCodeHistory[] | null
    patientFile: PatientFile[] | null
    patientRelateHealthFacility: PatientRelateHealthFacility[] | null
  }
