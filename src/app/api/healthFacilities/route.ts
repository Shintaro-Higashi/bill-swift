import { queryToObject } from '@/core/utils/commonUtil'
import { HealthFacilityCreationSchema, HealthFacilityQueryRequest, HealthFacilityQuerySchema } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { fetchPagedHealthFacilities } from '@/servers/services/healthFacilityService'
import { performRequest } from '@/core/utils/requestUtil'

/**
 * 施設リストを取得するAPIです。
 * @param req リクエスト情報
 */
export async function GET(req: NextRequest) {
  return await performRequest(async () => {
    const query = queryToObject<HealthFacilityQueryRequest>(new URL(req.url).searchParams)
    const parseQuery = HealthFacilityQuerySchema.parse(query)
    const response = await fetchPagedHealthFacilities(parseQuery)
    return NextResponse.json(response)
  })
}
