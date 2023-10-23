import { NextRequest, NextResponse } from 'next/server'
import { ByIdRequest, PatientChangeHistoryQueryRequest, PatientChangeHistoryQuerySchema } from '@/types'
import { performRequest } from '@/core/utils/requestUtil'
import { queryToObject } from '@/core/utils/commonUtil'
import { fetchPagedPatientChangeHistories } from '@/servers/services/patientChangeHistoryService'

/**
 * 患者の変更履歴情報を取得するAPIです。
 */
export async function GET(req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(async () => {
    const query = queryToObject<PatientChangeHistoryQueryRequest>(new URL(req.url).searchParams)
    query.patientId = id
    const parseQuery = PatientChangeHistoryQuerySchema.parse(query)
    const response = await fetchPagedPatientChangeHistories(parseQuery)
    return NextResponse.json(response)
  })
}
