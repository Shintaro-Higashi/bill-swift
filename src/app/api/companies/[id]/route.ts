import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import { CompanyEditing, CompanyEditingSchema } from '@/types/companies'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { badRequestErrorResponse, notFoundResponse } from '@/core/utils/responseUtil'
import { archiveCompany, fetchCompany, updateCompany } from '@/servers/services/CompanyService'
// パスパラメータ
type Params = {
  // 会社ID
  id: string
}

/**
 * 会社詳細情報を取得するAPIです。
 */
export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const entity = await fetchCompany(params.id)
  if (!entity) {
    return notFoundResponse()
  }
  return NextResponse.json(entity)
}

/**
 * 会社を編集するAPIです。
 * @param req リクエスト情報
 * @param params パスパラメータ
 */
export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const editData = await req.json()
  const parsed = CompanyEditingSchema.safeParse(editData)
  if (!parsed.success) {
    return badRequestErrorResponse(parsed.error)
  }
  const response = await updateCompany(params.id, parsed.data)
  return NextResponse.json(response)
}

/**
 * 会社詳細情報を削除するAPIです。
 */
export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const entity = await archiveCompany(params.id)
  return NextResponse.json({ id: entity.id })
}
