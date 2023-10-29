import { NextRequest, NextResponse } from 'next/server'
import {
  ByIdRequest,
  PatientHealthFacilityEditingDto,
  PatientHealthFacilityEditingSchema,
  PatientHealthFacilityRelocationEditingSchema,
} from '@/types'
import { performRequest } from '@/core/utils/requestUtil'
import {
  fetchPatientHealthFacilities,
  upsertPatientHealthFacility,
} from '@/servers/services/patientRelateHealthFacilityService'
import {
  iChangeHealthFacilityDeceaseExitReason,
  isFutureChangedPatientHealthFacility,
} from '@/shared/services/patientRelateHealthFacilityService'
import { z } from 'zod'
import { fetchPatient } from '@/servers/services/patientService'
import { fetchPatientRelateHealthFacilitiesByPatientId } from '@/servers/repositories/patientRelateHealthFacilityRepository'
import { isAfter } from 'date-fns'
import { loggerInfo } from '@/core/configs/log'

/**
 * 患者の所属施設情報を変更するAPIです。
 * <pre>
 *   下記２つの変更を処理可能です。
 *  ・所属施設を変更する処理
 *  ・所属施設を退出する処理
 * </pre>
 * @param req リクエスト情報
 */
export async function PATCH(req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(
    async () => {
      const editData = await req.json()
      const parsedEditData = PatientHealthFacilityEditingSchema.parse(editData)
      await validateChangeHealthFacilityByExtendsSchema(id, parsedEditData)
      await upsertPatientHealthFacility(id, parsedEditData)
      return NextResponse.json({ status: 'ok' })
    },
    { action: 'change-health-facilities' },
  )
}

/**
 * 施設変更入力情報に対してバックエンド側でしか処理できない独自の検証を行います。
 * @param parsedEditData 入力パラメータ
 * @thorw ZodError バリデーションエラー発生時
 */
const validateChangeHealthFacilityByExtendsSchema = async (
  patientId: string,
  parsedEditData: PatientHealthFacilityEditingDto,
) => {
  // 共通: すでに予約がある場合はNG
  const patientHealthFacilities = await fetchPatientHealthFacilities(patientId)
  const refineValidationBaseSchema = z.object({
    reason: z.string().refine(() => {
      return !isFutureChangedPatientHealthFacility(patientHealthFacilities)
    }, 'すでに施設情報の変更予約があるため操作を継続できません'),
  })
  // 以降は可変
  if (iChangeHealthFacilityDeceaseExitReason(parsedEditData.reason)) {
    // 退出時
    await refineValidationBaseSchema
      .extend({
        endDate: z.date().refine(async (endDate: Date) => {
          const nowPatientHealthFacility = patientHealthFacilities[0]
          return isAfter(endDate, nowPatientHealthFacility.startDate)
        }, '現在所属中の施設入居日より後の日付を入力してください'),
      })
      .parseAsync(parsedEditData)
  } else {
    // 施設変更時
    await refineValidationBaseSchema
      .extend({
        // 同一施設NG
        healthFacilityId: z.string().refine(async () => {
          const patient = await fetchPatient(patientId)
          return patient.healthFacilityId !== parsedEditData.healthFacilityId
        }, '現在所属中の施設とは異なる施設を選択してください'),
        startDate: z.date().refine(async (startDate: Date) => {
          const nowPatientHealthFacility = patientHealthFacilities[0]
          return isAfter(startDate, nowPatientHealthFacility.startDate)
        }, '現在所属中の施設入居日より後の日付を入力してください'),
      })
      .parseAsync(parsedEditData)
  }
}

/**
 * 患者の所属施設履歴を取得するAPIです。
 * @param req リクエスト情報
 */
export async function GET(req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(async () => {
    const response = await fetchPatientHealthFacilities(id)
    return NextResponse.json(response)
  })
}
