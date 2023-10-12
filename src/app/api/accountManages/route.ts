import { queryToObject } from '@/core/utils/commonUtil'
import { AccountManageQueryRequest, AccountManageQuerySchema } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { performRequest } from '@/core/utils/requestUtil'
import { fetchPagedAccountManages } from '@/servers/repositories/accountManageRepository'

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
