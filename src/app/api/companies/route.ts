import { queryToObject } from '@/core/utils/commonUtil'
import { badRequestErrorResponse } from '@/core/utils/responseUtil'
import {
  CompanyCreation,
  CompanyCreationSchema,
  CompanyModel,
  CompanyQuery,
  CompanyQuerySchema,
} from '@/types/companies'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import { Prisma } from '.prisma/client'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { createId } from '@paralleldrive/cuid2'
import SortOrder = Prisma.SortOrder

/**
 * 会社のページング検索を実地します。
 * @param params 検索条件
 * @return 検索結果
 */
const _fetchPagedCompanies = async (params: CompanyQuery) => {
  const orderBy: Prisma.CompanyOrderByWithRelationInput[] = [{ id: SortOrder.asc }]
  if (params.sort && params.order) {
    orderBy.unshift({ [params.sort]: params.order })
  }

  return await prisma.company.paginate({
    where: { id: params.id, name: { contains: params.name }, existence: true },
    include: { userCompanyCreatedByTouser: true, userCompanyUpdatedByTouser: true },
    orderBy: orderBy,
    pageNo: params.pageNo,
    pageSize: params.pageSize,
  })
}

/**
 * 会社を作成します。
 * @param params
 */
const _createCompany = async (params: CompanyCreation) => {
  const now = getCurrentDate()

  return await prisma.$transaction(async (tx) => {
    return await tx.company.create({
      data: {
        id: createId(),
        ...params,
        createdBy: '1',
        updatedBy: '1',
        createdAt: now,
        updatedAt: now,
      },
    })
  })
}

/**
 * 会社リストを取得するAPIです。
 * @param req リクエスト情報
 */
export async function GET(req: NextRequest) {
  const query = queryToObject<CompanyQuery>(new URL(req.url).searchParams)
  const parsed = CompanyQuerySchema.safeParse(query)
  if (!parsed.success) {
    return badRequestErrorResponse(parsed.error)
  }
  const response = await _fetchPagedCompanies(parsed.data)
  return NextResponse.json(response)
}

/**
 * 会社を作成するAPIです。
 * @param req リクエスト情報
 */
export async function POST(req: NextRequest) {
  const createData = await req.json()
  const parsed = CompanyCreationSchema.safeParse(createData)
  if (!parsed.success) {
    return badRequestErrorResponse(parsed.error)
  }
  const response = await _createCompany(parsed.data)
  return NextResponse.json(response)
}
