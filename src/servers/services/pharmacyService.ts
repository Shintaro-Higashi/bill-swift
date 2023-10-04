import { PharmacyCreationDto, PharmacyEditingDto, PharmacyQueryDto } from '@/types'
import {
  archivePharmacy as archive,
  createPharmacy as create,
  fetchPharmacy as fetch,
  fetchPagedPharmacies as fetchPaged,
  updatePharmacy as update,
} from '@/servers/repositories/pharmacyRepository'
import depend from '@/core/utils/velona'
import { performTransaction } from '@/servers/repositories/performTransaction'

/**
 * 店舗のページング検索を実地します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedPharmacies = depend({ fetchPaged }, async ({ fetchPaged }, params: PharmacyQueryDto) => {
  return await fetchPaged(params)
})

/**
 * 指定IDの店舗情報を取得します。
 * @param id 店舗ID
 * @return 店舗情報
 */
export const fetchPharmacy = depend({ fetch }, async ({ fetch }, id: string) => {
  return await fetch(id)
})

/**
 * 店舗を作成します。
 * @param params
 */
export const createPharmacy = depend({ create }, async ({ create }, params: PharmacyCreationDto) => {
  return await performTransaction(async (tx: any) => {
    const tCreate: typeof create = (create as any).inject({ client: tx })
    return await tCreate(params)
  })
})

/**
 * 指定の店舗情報を更新します。
 * @param id 店舗ID
 * @param params 店舗情報
 */
export const updatePharmacy = depend({ update }, async ({ update }, id: string, params: PharmacyEditingDto) => {
  return await performTransaction(async (tx: any) => {
    const tUpdate: typeof update = (update as any).inject({ client: tx })
    return await tUpdate(id, params)
  })
})

/**
 * 指定IDの店舗情報を論理削除します。
 * @param id 店舗ID
 * @return 店舗情報
 */
export const archivePharmacy = depend({ archive }, async ({ archive }, id: string) => {
  return await performTransaction(async (tx: any) => {
    const tArchive: typeof archive = (archive as any).inject({ client: tx })
    return await tArchive(id)
  })
})
