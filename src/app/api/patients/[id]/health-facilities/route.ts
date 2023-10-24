import { NextRequest, NextResponse } from 'next/server'
import {
  ByIdRequest,
  CompanyEditingSchema,
  PatientChangeHistoryQueryRequest,
  PatientChangeHistoryQuerySchema,
  PatientHealthFacilityEditingSchema,
} from '@/types'
import { performRequest } from '@/core/utils/requestUtil'
import { queryToObject } from '@/core/utils/commonUtil'
import { fetchPagedPatientChangeHistories } from '@/servers/services/patientChangeHistoryService'
import { updatePatientHealthFacility } from '@/servers/services/patientService'

/**
 * 患者の新規所属施設を作成するAPIです。
 * @param req リクエスト情報
 */
export async function POST(req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(
    async () => {
      const editData = await req.json()
      const parsedEditData = PatientHealthFacilityEditingSchema.parse(editData)
      await updatePatientHealthFacility(id, parsedEditData)
      return NextResponse.json({ status: 'ok' })
    },
    { action: 'edit-health-facilities' },
  )
}
