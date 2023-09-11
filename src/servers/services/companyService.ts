import { CompanyCreationDto, CompanyEditingDto, CompanyQueryDto } from '@/types'
import {
  archiveCompany as archive,
  createCompany as create,
  fetchCompany as fetch,
  fetchPagedCompanies as fetchPaged,
  updateCompany as update,
} from '@/servers/repositories/companyRepository'
import depend from '@/core/utils/velona'
import { performTransaction } from '@/servers/repositories/performTransaction'

/**
 * 会社のページング検索を実地します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedCompanies = depend({ fetchPaged }, async ({ fetchPaged }, params: CompanyQueryDto) => {
  return await fetchPaged(params)
})

/**
 * 指定IDの会社情報を取得します。
 * @param id 会社ID
 * @return 会社情報
 */
export const fetchCompany = depend({ fetch }, async ({ fetch }, id: string) => {
  return await fetch(id)
})

/**
 * 会社を作成します。
 * @param params
 */
export const createCompany = depend({ create }, async ({ create }, params: CompanyCreationDto) => {
  return await performTransaction(async (tx: any) => {
    const tCreate: typeof create = (create as any).inject({ client: tx })
    return await tCreate(params)
  })
})

/**
 * 指定の会社情報を更新します。
 * @param id 会社ID
 * @param params 会社情報
 */
export const updateCompany = depend({ update }, async ({ update }, id: string, params: CompanyEditingDto) => {
  return await performTransaction(async (tx: any) => {
    const tUpdate: typeof update = (update as any).inject({ client: tx })
    return await tUpdate(id, params)
  })
})

/**
 * 指定IDの会社情報を論理削除します。
 * @param id 会社ID
 * @return 会社情報
 */
export const archiveCompany = depend({ archive }, async ({ archive }, id: string) => {
  return await performTransaction(async (tx: any) => {
    const tArchive: typeof archive = (archive as any).inject({ client: tx })
    return await tArchive(id)
  })
})
