import { AccountManageCreationDto, AccountManageEditingDto, AccountManageQueryDto } from '@/types'
import {
  archiveAccountManage as archive,
  createAccountManage as create,
  fetchAccountManage as fetch,
  fetchPagedAccountManages as fetchPaged,
  updateAccountManage as update,
} from '@/servers/repositories/accountManageRepository'
import depend from '@/core/utils/velona'
import { performTransaction } from '../repositories/performTransaction'

/**
 * 口座管理のページング検索を実地します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedAccountManages = depend(
  { fetchPaged },
  async ({ fetchPaged }, params: AccountManageQueryDto) => {
    return await fetchPaged(params)
  },
)

/**
 * 指定IDの口座管理を取得します。
 * @param id ID
 * @return 口座管理
 */
export const fetchAccountManage = depend({ fetch }, async ({ fetch }, id: string) => {
  return await fetch(id)
})

/**
 * 口座管理を作成します。
 * @param params
 */
export const createAccountManage = depend({ create }, async ({ create }, params: AccountManageCreationDto) => {
  return await performTransaction(async (tx: any) => {
    const tCreate: typeof create = (create as any).inject({ client: tx })
    return await tCreate(params)
  })
})

/**
 * 指定の口座管理を更新します。
 * @param id ID
 * @param params 口座管理
 */
export const updateAccountManage = depend(
  { update },
  async ({ update }, id: string, params: AccountManageEditingDto) => {
    return await performTransaction(async (tx: any) => {
      const tUpdate: typeof update = (update as any).inject({ client: tx })
      return await tUpdate(id, params)
    })
  },
)

/**
 * 指定IDの口座管理を論理削除します。
 * @param id ID
 * @return 口座管理
 */
export const archiveAccountManage = depend({ archive }, async ({ archive }, id: string) => {
  return await performTransaction(async (tx: any) => {
    const tArchive: typeof archive = (archive as any).inject({ client: tx })
    return await tArchive(id)
  })
})
