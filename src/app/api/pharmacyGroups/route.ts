import { queryToObject } from '@/core/utils/commonUtil'
import { PharmacyGroupQueryRequest, PharmacyGroupQuerySchema } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { fetchPagedPharmacyGroups } from '@/servers/services/pharmacyGroupService'
import { performRequest } from '@/core/utils/requestUtil'

/**
 * 薬局リストを取得するAPIです。
 * @param req リクエスト情報
 */
export async function GET(req: NextRequest) {
  return await performRequest(async () => {
    const query = queryToObject<PharmacyGroupQueryRequest>(new URL(req.url).searchParams)
    const parseQuery = PharmacyGroupQuerySchema.parse(query)
    const response = await fetchPagedPharmacyGroups(parseQuery)
    return NextResponse.json(response)
  })
}
