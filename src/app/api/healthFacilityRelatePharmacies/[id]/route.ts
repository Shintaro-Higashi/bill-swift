import { NextRequest, NextResponse } from 'next/server'
import { ByIdRequest } from '@/types'
import { fetchHealthFacilityRelatePharmacy } from '@/servers/services/healthFacilityRelatePharmacyService'
import { performRequest } from '@/core/utils/requestUtil'

/**
 * 施設関連薬局詳細情報を取得するAPIです。
 */
export async function GET(_req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(async () => {
    const entity = await fetchHealthFacilityRelatePharmacy(id)
    return NextResponse.json(entity)
  })
}
