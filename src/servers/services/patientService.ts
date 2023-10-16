import { PatientQueryDto } from '@/types'
import { fetchPagedPatients as fetchPaged, fetchPatient as fetch } from '@/servers/repositories/patientRepository'
import depend from '@/core/utils/velona'
// import { performTransaction } from '@/servers/repositories/performTransaction'

/**
 * 患者のページング検索を実地します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedPatients = depend({ fetchPaged }, async ({ fetchPaged }, params: PatientQueryDto) => {
  return await fetchPaged(params)
})

/**
 * 指定IDの患者情報を取得します。
 * @param id 患者ID
 * @return 患者情報
 */
export const fetchPatient = depend({ fetch }, async ({ fetch }, id: string) => {
  return await fetch(id)
})

// /**
//  * 患者を作成します。
//  * @param params
//  */
// export const createPatient = depend({ create }, async ({ create }, params: PatientCreationDto) => {
//   return await performTransaction(async (tx: any) => {
//     const tCreate: typeof create = (create as any).inject({ client: tx })
//     return await tCreate(params)
//   })
// })
//
// /**
//  * 指定の患者情報を更新します。
//  * @param id 患者ID
//  * @param params 患者情報
//  */
// export const updatePatient = depend({ update }, async ({ update }, id: string, params: PatientEditingDto) => {
//   return await performTransaction(async (tx: any) => {
//     const tUpdate: typeof update = (update as any).inject({ client: tx })
//     return await tUpdate(id, params)
//   })
// })
//
// /**
//  * 指定IDの患者情報を論理削除します。
//  * @param id 患者ID
//  * @return 患者情報
//  */
// export const archivePatient = depend({ archive }, async ({ archive }, id: string) => {
//   return await performTransaction(async (tx: any) => {
//     const tArchive: typeof archive = (archive as any).inject({ client: tx })
//     return await tArchive(id)
//   })
// })
