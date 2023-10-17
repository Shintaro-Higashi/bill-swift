import { NextRequest, NextResponse } from 'next/server'
import { ByIdRequest, PharmacyEditingSchema } from '@/types'
import { archivePharmacy, fetchPharmacy, updatePharmacy } from '@/servers/services/pharmacyService'
import { performRequest } from '@/core/utils/requestUtil'
import {
  validatePharmacyChangedCompany,
  validatePharmacyChangedCompanyMessage,
} from '@/servers/shared/validators/validatePharmacyChangedCompany'

/**
 * 店舗詳細情報を取得するAPIです。
 */
export async function GET(_req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(async () => {
    const entity = await fetchPharmacy(id)
    return NextResponse.json(entity)
  })
}

/**
 * 店舗を編集するAPIです。
 * @param req リクエスト情報
 * @param params パスパラメータ
 */
export async function PATCH(req: NextRequest, { params }: { params: ByIdRequest }) {
  return await performRequest(
    async () => {
      const editData = await req.json()
      const extendsEditingSchema = createAddServerValidationEditingSchema(params.id)
      const parsedEditData = await extendsEditingSchema.parseAsync(editData)
      const response = await updatePharmacy(params.id, parsedEditData)
      return NextResponse.json(response)
    },
    { action: 'edit' },
  )
}

/**
 * バックエンド独自のバリデーション定義を追加した店舗編集Schemaを作成します。
 * @param pharmacyId 店舗ID
 * @return バックエンド独自のバリデーションを追加した店舗編集Schema
 */
const createAddServerValidationEditingSchema = (pharmacyId: string) => {
  const zCompanyId = PharmacyEditingSchema.shape.companyId
  const extendsZCompanyId = zCompanyId.refine(
    async (companyId) => validatePharmacyChangedCompany(pharmacyId, companyId),
    validatePharmacyChangedCompanyMessage,
  )
  return PharmacyEditingSchema.extend({ companyId: extendsZCompanyId })
}

/**
 * 店舗詳細情報を削除するAPIです。
 */
export async function DELETE(_req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(
    async () => {
      const entity = await archivePharmacy(id)
      return NextResponse.json({ id: entity.id })
    },
    { action: 'archive' },
  )
}
