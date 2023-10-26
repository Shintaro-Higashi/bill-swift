import { NextRequest, NextResponse } from 'next/server'
import { ByIdRequest, PatientHealthFacilityEditingSchema } from '@/types'
import { performRequest } from '@/core/utils/requestUtil'
import {
  fetchPatientHealthFacility,
  upsertPatientHealthFacility,
} from '@/servers/services/patientRelateHealthFacilityService'

/**
 * 患者の所属施設を変更するAPIです。
 * @param req リクエスト情報
 */
export async function PATCH(req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(
    async () => {
      const editData = await req.json()
      const parsedEditData = PatientHealthFacilityEditingSchema.parse(editData)
      await upsertPatientHealthFacility(id, parsedEditData)
      return NextResponse.json({ status: 'ok' })
    },
    { action: 'edit-health-facilities' },
  )
}

/**
 * 患者の所属施設履歴を取得するAPIです。
 * @param req リクエスト情報
 */
export async function GET(req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(async () => {
    const response = await fetchPatientHealthFacility(id)
    return NextResponse.json(response)
  })
}
