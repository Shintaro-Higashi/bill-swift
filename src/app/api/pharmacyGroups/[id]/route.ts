import { NextRequest, NextResponse } from 'next/server'
import { fetchPharmacyGroup } from '@/servers/services/pharmacyGroupService'
import { ByIdRequest } from '@/types'
import { performRequest } from '@/core/utils/requestUtil'

/**
 * 薬局詳細情報を取得するAPIです。
 */
export async function GET(_req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(async () => {
    const entity = await fetchPharmacyGroup(id)
    return NextResponse.json(entity)
  })
}
