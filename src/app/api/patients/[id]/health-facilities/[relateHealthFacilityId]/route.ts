import { NextRequest, NextResponse } from 'next/server'
import { ByIdRequest, PatientHealthFacilityEditingSchema } from '@/types'
import { performRequest } from '@/core/utils/requestUtil'
import {
  cancelFuturePatientHealthFacility,
  updatePatientHealthFacility,
} from '@/servers/services/patientRelateHealthFacilityService'

type Params = ByIdRequest & {
  // 患者関連施設ID
  relateHealthFacilityId: string
}

/**
 * 患者の関連所属施設を修正するAPIです。
 * <pre>
 *  まだ未処理の場合のみ修正が可能です。
 * </pre>
 */
export async function PATCH(req: NextRequest, { params: { id, relateHealthFacilityId } }: { params: Params }) {
  return await performRequest(
    async () => {
      const editData = await req.json()
      // TODO まだ未処理のデータのみ処理可能とする
      const parsedEditData = PatientHealthFacilityEditingSchema.parse(editData)
      await updatePatientHealthFacility(relateHealthFacilityId, parsedEditData)
      return NextResponse.json({ status: 'ok' })
    },
    { action: 'change-health-facilities' },
  )
}

/**
 * 患者の関連所属施設変更予定を削除するAPIです。
 * <pre>
 *  まだ未処理の場合のみ修正が可能です。
 * </pre>
 */
export async function DELETE(_req: NextRequest, { params: { id, relateHealthFacilityId } }: { params: Params }) {
  return await performRequest(
    async () => {
      const response = await cancelFuturePatientHealthFacility(relateHealthFacilityId)
      return NextResponse.json({ id, relateHealthFacilityId })
    },
    { action: 'change-health-facilities' },
  )
}
