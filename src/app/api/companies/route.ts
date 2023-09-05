import { queryToObject } from '@/core/utils/commonUtil'
import { badRequestErrorResponse } from '@/core/utils/responseUtil'
import { CompanyCreationSchema, CompanyQuery, CompanyQuerySchema } from '@/types/companies'
import { NextRequest, NextResponse } from 'next/server'
import { createCompany, fetchPagedCompanies } from '@/servers/services/CompanyService'

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

  const response = await fetchPagedCompanies(parsed.data)
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
  const response = await createCompany(parsed.data)
  return NextResponse.json(response)
}
