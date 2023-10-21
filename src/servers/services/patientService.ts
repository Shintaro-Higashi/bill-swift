import { PatientEditingDto, PatientQueryDto } from '@/types'
import {
  fetchPagedPatients as fetchPaged,
  fetchPatient as fetch,
  updatePatient as update,
} from '@/servers/repositories/patientRepository'
import depend from '@/core/utils/velona'
import { performTransaction } from '@/servers/repositories/performTransaction'

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

/**
 * 指定の患者情報を更新します。
 * @param id 患者ID
 * @param params 患者情報
 */
export const updatePatient = depend({ update }, async ({ update }, id: string, params: PatientEditingDto) => {
  return await performTransaction(async (tx: any) => {
    params.billEnableFlag = isBillEnablePatient(params)
    const tUpdate: typeof update = (update as any).inject({ client: tx })
    return await tUpdate(id, params)
  })
})

/**
 * 患者が請求可能か判定します。
 * TODO 暫定仕様で概ね全部そろえばよしとする(期限が過ぎたらNGにするなどは今後必要なのか？)
 * @param params
 */
const isBillEnablePatient = (params: PatientEditingDto) => {
  // [同意書]
  if (params.consentStatus !== 'COLLECTED' || !params.consentConfirmDate) return false
  // [医療保険]
  if (
    // ステータス
    params.medicalInsuranceStatus !== 'CONFIRMED' ||
    !params.medicalInsuranceStartDate ||
    !params.medicalInsuranceEndDate ||
    // 負担割合
    params.medicalShare == null ||
    params.medicalShare === 'NONE' ||
    !params.medicalShareConfirmDate
  )
    return false
  // [介護保険]
  if (
    // ステータス
    params.nursingInsuranceStatus !== 'CONFIRMED' ||
    !params.nursingInsuranceStartDate ||
    !params.nursingInsuranceEndDate ||
    // 負担割合
    params.nursingShare == null ||
    params.nursingShare === 'NONE' ||
    !params.nursingShareConfirmDate
  )
    return false
  // [支払種別 (振替変更停止はNG)]
  if (!params.paymentType || params.paymentType === 'UNDEFINED' || params.paymentType === 'WITHDRAWAL_STOP')
    return false
  // 振替時は口座情報も必要
  if (params.paymentType === 'WITHDRAWAL' || params.paymentType === 'WITHDRAWAL_CONTINUE') {
    if (params.accountConfirmStatus !== 'AVAILABLE' || !params.accountManageId) return false
  }
  // [公費]
  if (params.publicExpense == null) return false

  return true
}

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
