import { queryToObject } from '@/core/utils/commonUtil'
import { PatientQueryRequest, PatientQuerySchema } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { fetchPagedPatients } from '@/servers/services/patientService'
import { performRequest } from '@/core/utils/requestUtil'

/**
 * 患者リストを取得するAPIです。
 * @param req リクエスト情報
 */
export async function GET(req: NextRequest) {
  return await performRequest(async () => {
    const query = queryToObject<PatientQueryRequest>(new URL(req.url).searchParams)
    const parseQuery = PatientQuerySchema.parse(query)
    const response = await fetchPagedPatients(parseQuery)
    return NextResponse.json(response)
  })
}

// /**
//  * 患者を作成するAPIです。
//  * @param req リクエスト情報
//  */
// export async function POST(req: NextRequest) {
//   return await performRequest(
//     async () => {
//       const createData = await req.json()
//       const parsedCreateData = PatientCreationSchema.parse(createData)
//       const response = await createPatient(parsedCreateData)
//       return NextResponse.json(response)
//     },
//     { action: 'create' },
//   )
// }
