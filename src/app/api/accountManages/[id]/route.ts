import { NextRequest, NextResponse } from 'next/server'
import { ByIdRequest, AccountManageEditingSchema } from '@/types'
import {
  archiveAccountManage,
  fetchAccountManage,
  updateAccountManage,
} from '@/servers/repositories/accountManageRepository'
import { performRequest } from '@/core/utils/requestUtil'

/**
 * 口座管理詳細情報を取得するAPIです。
 */
export async function GET(_req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(async () => {
    const entity = await fetchAccountManage(id)
    return NextResponse.json(entity)
  })
}

/**
 * 口座管理を編集するAPIです。
 * @param req リクエスト情報
 * @param params パスパラメータ
 */
export async function PATCH(req: NextRequest, { params }: { params: ByIdRequest }) {
  return await performRequest(
    async () => {
      const editData = await req.json()
      const parsedEditData = AccountManageEditingSchema.parse(editData)
      const response = await updateAccountManage(params.id, parsedEditData)
      return NextResponse.json(response)
    },
    { action: 'edit' },
  )
}

/**
 * 口座管理を削除するAPIです。
 */
export async function DELETE(_req: NextRequest, { params: { id } }: { params: ByIdRequest }) {
  return await performRequest(
    async () => {
      const entity = await archiveAccountManage(id)
      return NextResponse.json({ id: entity.id })
    },
    { action: 'archive' },
  )
}
