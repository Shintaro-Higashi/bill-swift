import { NextRequest, NextResponse } from 'next/server'
import { ByIdRequest, HealthFacilityEditingSchema } from '@/types'
import { fetchHealthFacility, updateHealthFacility } from '@/servers/services/healthFacilityService'
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

/**
 * 施設を編集するAPIです。
 * @param req リクエスト情報
 * @param params パスパラメータ
 */
export async function PATCH(req: NextRequest, { params }: { params: ByIdRequest }) {
  return await performRequest(
    async () => {
      const editData = await req.json()
      const parsedEditData = HealthFacilityEditingSchema.parse(editData)
      const response = await updateHealthFacility(params.id, parsedEditData)
      return NextResponse.json(response)
    },
    { action: 'edit' },
  )
}
