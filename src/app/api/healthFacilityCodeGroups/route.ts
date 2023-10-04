import { queryToObject } from '@/core/utils/commonUtil'
import { HealthFacilityCodeGroupQueryRequest, HealthFacilityCodeGroupQuerySchema } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { fetchPagedHealthFacilityCodeGroups } from '@/servers/services/healthFacilityCodeGroupService'
import { performRequest } from '@/core/utils/requestUtil'

/**
 * 施設コードグループリストを取得するAPIです。
 * @param req リクエスト情報
 */
export async function GET(req: NextRequest) {
  return await performRequest(async () => {
    const query = queryToObject<HealthFacilityCodeGroupQueryRequest>(new URL(req.url).searchParams)
    const parseQuery = HealthFacilityCodeGroupQuerySchema.parse(query)
    const response = await fetchPagedHealthFacilityCodeGroups(parseQuery)
    return NextResponse.json(response)
  })
}
