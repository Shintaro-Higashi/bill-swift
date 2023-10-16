import { NextRequest, NextResponse } from 'next/server'
import { ByIdRequest } from '@/types'
import { fetchPatient } from '@/servers/services/patientService'
import { performRequest } from '@/core/utils/requestUtil'

/**
 * 患者詳細情報を取得するAPIです。
 */
export async function GET(_req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(async () => {
    const entity = await fetchPatient(id)
    return NextResponse.json(entity)
  })
}

// /**
//  * 患者を編集するAPIです。
//  * @param req リクエスト情報
//  * @param params パスパラメータ
//  */
// export async function PATCH(req: NextRequest, { params }: { params: ByIdRequest }) {
//   return await performRequest(
//     async () => {
//       const editData = await req.json()
//       const parsedEditData = PatientEditingSchema.parse(editData)
//       const response = await updatePatient(params.id, parsedEditData)
//       return NextResponse.json(response)
//     },
//     { action: 'edit' },
//   )
// }

// /**
//  * 患者詳細情報を削除するAPIです。
//  */
// export async function DELETE(_req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
//   return await performRequest(
//     async () => {
//       const entity = await archivePatient(id)
//       return NextResponse.json({ id: entity.id })
//     },
//     { action: 'archive' },
//   )
// }
