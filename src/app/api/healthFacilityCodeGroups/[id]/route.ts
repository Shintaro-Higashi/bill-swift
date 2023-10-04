import { NextRequest, NextResponse } from 'next/server'
import { fetchHealthFacilityCodeGroup } from '@/servers/services/healthFacilityCodeGroupService'
import { ByIdRequest } from '@/types'
import { performRequest } from '@/core/utils/requestUtil'

/**
 * 施設コードグループ詳細情報を取得するAPIです。
 */
export async function GET(_req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(async () => {
    const entity = await fetchHealthFacilityCodeGroup(id)
    return NextResponse.json(entity)
  })
}
