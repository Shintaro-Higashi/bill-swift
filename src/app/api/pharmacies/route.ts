import { queryToObject } from '@/core/utils/commonUtil'
import { PharmacyCreationSchema, PharmacyQueryRequest, PharmacyQuerySchema } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { createPharmacy, fetchPagedPharmacies } from '@/servers/services/pharmacyService'
import { performRequest } from '@/core/utils/requestUtil'

/**
 * 店舗リストを取得するAPIです。
 * @param req リクエスト情報
 */
export async function GET(req: NextRequest) {
  return await performRequest(async () => {
    const query = queryToObject<PharmacyQueryRequest>(new URL(req.url).searchParams)
    const parseQuery = PharmacyQuerySchema.parse(query)
    const response = await fetchPagedPharmacies(parseQuery)
    return NextResponse.json(response)
  })
}

/**
 * 店舗を作成するAPIです。
 * @param req リクエスト情報
 */
export async function POST(req: NextRequest) {
  return await performRequest(async () => {
    const createData = await req.json()
    const parsedCreateData = PharmacyCreationSchema.parse(createData)
    const response = await createPharmacy(parsedCreateData)
    return NextResponse.json(response)
  })
}
