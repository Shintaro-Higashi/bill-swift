import { NextRequest, NextResponse } from 'next/server'
import { ByIdRequest, PatientHealthFacilityEditingSchema } from '@/types'
import { performRequest } from '@/core/utils/requestUtil'
import {
  fetchPatientHealthFacilities,
  upsertPatientHealthFacility,
  validateChangeHealthFacilityByExtendsSchema,
} from '@/servers/services/patientRelateHealthFacilityService'

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
 * 患者の所属施設履歴を取得するAPIです。
 * @param req リクエスト情報
 */
export async function GET(req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(async () => {
    const response = await fetchPatientHealthFacilities(id)
    return NextResponse.json(response)
  })
}
