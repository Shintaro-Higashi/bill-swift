import { queryToObject } from '@/core/utils/commonUtil'
import { AccountManageCreationSchema, AccountManageQueryRequest, AccountManageQuerySchema } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { performRequest } from '@/core/utils/requestUtil'
import { createAccountManage, fetchPagedAccountManages } from '@/servers/services/accountManageService'

/**
 * 口座管理リストを取得するAPIです。
 * @param req リクエスト情報
 */
export async function GET(req: NextRequest) {
  return await performRequest(async () => {
    const query = queryToObject<AccountManageQueryRequest>(new URL(req.url).searchParams)
    const parseQuery = AccountManageQuerySchema.parse(query)
    const response = await fetchPagedAccountManages(parseQuery)
    return NextResponse.json(response)
  })
}

/**
 * 口座管理を作成するAPIです。
 * @param req リクエスト情報
 */
export async function POST(req: NextRequest) {
  return await performRequest(
    async () => {
      const createData = await req.json()
      const parsedCreateData = AccountManageCreationSchema.parse(createData)
      const response = await createAccountManage(parsedCreateData)
      return NextResponse.json(response)
    },
    { action: 'create' },
  )
}
