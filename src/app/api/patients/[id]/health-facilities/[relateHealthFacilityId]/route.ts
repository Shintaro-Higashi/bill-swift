import { NextRequest, NextResponse } from 'next/server'
import { ByIdRequest, PatientHealthFacilityEditingSchema } from '@/types'
import { performRequest } from '@/core/utils/requestUtil'
import {
  fetchPatientHealthFacility,
  upsertPatientHealthFacility,
} from '@/servers/services/patientRelateHealthFacilityService'

type Params = ByIdRequest & {
  // 関連施設ID
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
      await upsertPatientHealthFacility(id, parsedEditData)
      return NextResponse.json({ status: 'ok' })
    },
    { resource: 'patients', action: 'edit', id },
  )
}

/**
 * 患者の関連所属施設を修正するAPIです。
 * <pre>
 *  まだ未処理の場合のみ修正が可能です。
 * </pre>
 */
export async function DELETE(_req: NextRequest, { params: { id, relateHealthFacilityId } }: { params: Params }) {
  return await performRequest(
    async () => {
      // TODO まだ未処理のデータのみ処理可能とする
      const response = await fetchPatientHealthFacility(id)
      return NextResponse.json({ id, relateHealthFacilityId })
    },
    { resource: 'patients', action: 'edit', id },
  )
}
