import { NextRequest, NextResponse } from 'next/server'
import { ByIdRequest, CompanyEditingSchema } from '@/types'
import { archiveCompany, fetchCompany, updateCompany } from '@/servers/services/companyService'
import { performRequest } from '@/core/utils/requestUtil'

/**
 * 会社詳細情報を取得するAPIです。
 */
export async function GET(_req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(async () => {
    const entity = await fetchCompany(id)
    return NextResponse.json(entity)
  })
}

/**
 * 会社を編集するAPIです。
 * @param req リクエスト情報
 * @param params パスパラメータ
 */
export async function PATCH(req: NextRequest, { params }: { params: ByIdRequest }) {
  return await performRequest(
    async () => {
      const editData = await req.json()
      const parsedEditData = CompanyEditingSchema.parse(editData)
      const response = await updateCompany(params.id, parsedEditData)
      return NextResponse.json(response)
    },
    { action: 'edit' },
  )
}

/**
 * 会社詳細情報を削除するAPIです。
 */
export async function DELETE(_req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(
    async () => {
      const entity = await archiveCompany(id)
      return NextResponse.json({ id: entity.id })
    },
    { action: 'archive' },
  )
}
