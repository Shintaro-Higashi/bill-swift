import { queryToObject } from '@/core/utils/commonUtil'
import { HealthFacilityCreationSchema, HealthFacilityQueryRequest, HealthFacilityQuerySchema } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { createHealthFacility, fetchPagedHealthFacilities } from '@/servers/services/healthFacilityService'
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

/**
 * 施設を作成するAPIです。
 * @param req リクエスト情報
 */
export async function POST(req: NextRequest) {
  return await performRequest(
    async () => {
      const createData = await req.json()
      const parsedCreateData = HealthFacilityCreationSchema.parse(createData)
      const response = await createHealthFacility(parsedCreateData)
      return NextResponse.json(response)
    },
    { action: 'create' },
  )
}
