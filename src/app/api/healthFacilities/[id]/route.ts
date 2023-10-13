import { NextRequest, NextResponse } from 'next/server'
import { ByIdRequest } from '@/types'
import { fetchHealthFacility } from '@/servers/services/healthFacilityService'
import { performRequest } from '@/core/utils/requestUtil'

/**
 * 施設詳細情報を取得するAPIです。
 */
export async function GET(_req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(async () => {
    const entity = await fetchHealthFacility(id)
    return NextResponse.json(entity)
  })
}
