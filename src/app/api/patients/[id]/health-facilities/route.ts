import { NextRequest, NextResponse } from 'next/server'
import { ByIdRequest, PatientChangeHistoryQueryRequest, PatientChangeHistoryQuerySchema } from '@/types'
import { performRequest } from '@/core/utils/requestUtil'
import { queryToObject } from '@/core/utils/commonUtil'
import { fetchPagedPatientChangeHistories } from '@/servers/services/patientChangeHistoryService'

/**
 * 患者の新規所属施設を作成するAPIです。
 * @param req リクエスト情報
 */
export async function POST(req: NextRequest) {
  return await performRequest(
    async () => {
      return NextResponse.json({ status: 'ok' })
    },
    { action: 'edit-health-facilities' },
  )
}
