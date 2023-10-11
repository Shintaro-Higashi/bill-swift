import { queryToObject } from '@/core/utils/commonUtil'
import { CompanyCreationSchema, CompanyQueryRequest, CompanyQuerySchema } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { createCompany, fetchPagedCompanies } from '@/servers/services/companyService'
import { performRequest } from '@/core/utils/requestUtil'

/**
 * 会社リストを取得するAPIです。
 * @param req リクエスト情報
 */
export async function GET(req: NextRequest) {
  return await performRequest(async () => {
    const query = queryToObject<CompanyQueryRequest>(new URL(req.url).searchParams)
    const parseQuery = CompanyQuerySchema.parse(query)
    const response = await fetchPagedCompanies(parseQuery)
    return NextResponse.json(response)
  })
}

/**
 * 会社を作成するAPIです。
 * @param req リクエスト情報
 */
export async function POST(req: NextRequest) {
  return await performRequest(
    async () => {
      const createData = await req.json()
      const parsedCreateData = CompanyCreationSchema.parse(createData)
      const response = await createCompany(parsedCreateData)
      return NextResponse.json(response)
    },
    { action: 'create' },
  )
}
