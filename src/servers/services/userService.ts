import { UserCreationDto, UserEditingDto, UserQueryDto } from '@/types'
import {
  archiveUser as archive,
  createUser as create,
  fetchPagedUsers as fetchPaged,
  fetchUser as fetch,
  fetchUserByUserId as fetchByUserId,
  updateUser as update,
} from '@/servers/repositories/userRepository'
import depend from '@/core/utils/velona'
import { performTransaction } from '@/servers/repositories/performTransaction'

/**
 * ユーザのページング検索を実地します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedUsers = depend({ fetchPaged }, async ({ fetchPaged }, params: UserQueryDto) => {
  return await fetchPaged(params)
})

/**
 * 指定IDのユーザ情報を取得します。
 * @param id ユーザID
 * @return ユーザ情報
 */
export const fetchUser = depend({ fetch }, async ({ fetch }, id: string) => {
  return await fetch(id)
})

/**
 * 指定のログイン用ユーザIDに該当するユーザを取得します。
 * @param id ユーザID
 * @return ユーザ情報
 */
export const fetchUserByUserId = depend({ fetchByUserId }, async ({ fetchByUserId }, userId: string) => {
  return await fetchByUserId(userId)
})

/**
 * ユーザを作成します。
 * @param params
 */
export const createUser = depend({ create }, async ({ create }, params: UserCreationDto) => {
  return await performTransaction(async (tx: any) => {
    const tCreate: typeof create = (create as any).inject({ client: tx })
    return await tCreate(params)
  })
})

/**
 * 指定のユーザ情報を更新します。
 * @param id ユーザID
 * @param params ユーザ情報
 */
export const updateUser = depend({ update }, async ({ update }, id: string, params: UserEditingDto) => {
  return await performTransaction(async (tx: any) => {
    const tUpdate: typeof update = (update as any).inject({ client: tx })
    return await tUpdate(id, params)
  })
})

/**
 * 指定IDのユーザ情報を論理削除します。
 * @param id ユーザID
 * @return ユーザ情報
 */
export const archiveUser = depend({ archive }, async ({ archive }, id: string) => {
  return await performTransaction(async (tx: any) => {
    const tArchive: typeof archive = (archive as any).inject({ client: tx })
    return await tArchive(id)
  })
})
