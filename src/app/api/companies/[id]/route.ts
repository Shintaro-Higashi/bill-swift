import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import { CompanyEditing, CompanyEditingSchema } from '@/types/companies'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { badRequestErrorResponse, notFoundResponse } from '@/core/utils/responseUtil'
// パスパラメータ
type Params = {
  // 会社ID
  id: string
}

/**
 * 指定IDの会社情報を取得します。
 * @param id 会社ID
 * @return 会社情報
 */
const _fetchCompany = async (id: string) => {
  return await prisma.company.findUnique({
    where: { id: id, existence: true },
    include: { userCompanyCreatedByTouser: true, userCompanyUpdatedByTouser: true },
  })
}

/**
 * 指定の会社情報を更新します。
 * @param id 会社ID
 * @param params 会社情報
 */
const _updateCompany = async (id: string, params: CompanyEditing) => {
  const now = getCurrentDate()
  return await prisma.$transaction(async (tx) => {
    return await tx.company.update({
      data: {
        ...params,
        updatedBy: '1',
        updatedAt: now,
      },
      where: { id: id, existence: true },
    })
  })
}

/**
 * 指定の会社情報を論理削除します。
 * @param id 会社ID
 */
const _archiveCompany = async (id: string) => {
  const now = getCurrentDate()
  return await prisma.$transaction(async (tx) => {
    return await tx.company.update({
      data: {
        updatedBy: '1',
        deletedAt: now,
      },
      where: { id: id, deletedAt: null },
    })
  })
}

/**
 * 会社詳細情報を取得するAPIです。
 */
export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const entity = await _fetchCompany(params.id)
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
  const response = await _updateCompany(params.id, parsed.data)
  return NextResponse.json(response)
}

/**
 * 会社詳細情報を削除するAPIです。
 */
export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const entity = await _archiveCompany(params.id)
  return NextResponse.json({ id: entity.id })
}
