import {
  HealthFacilityCodeManageModel,
  PatientEditingDto,
  PatientHealthFacilityEditingDto,
  PatientModel,
  PatientQueryDto,
} from '@/types'
import {
  fetchPagedPatients as fetchPaged,
  fetchPatient as fetch,
  updatePatient as update,
  updatePatientUpdated,
} from '@/servers/repositories/patientRepository'
import {
  fetchPatientRelateHealthFacilitiesByPatientId,
  fetchPatientRelateHealthFacilityByPatient,
  createPatientRelateHealthFacility,
  updatePatientRelateHealthFacility,
} from '@/servers/repositories/patientRelateHealthFacilityRepository'
import { createPatientChangeHistory } from '@/servers/repositories/patientChangeHistoryRepository'
import { createManyPatientChangeContent } from '@/servers/repositories/patientChangeContentRepository'
import depend from '@/core/utils/velona'
import { performTransaction } from '@/servers/repositories/performTransaction'
import { createPatientChangeContentList } from '@/servers/services/patientChangeHistoryService'
import NoContentError from '@/servers/core/errors/noContentError'
import { isPast, subDays } from 'date-fns'
import { incrementHealthFacilityCodeManageSequenceNo } from '@/servers/repositories/healthFacilityCodeManageRepository'
import { createPatientCodeHistory } from '@/servers/repositories/patientCodeHistoryRepository'

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
export const updatePatient = depend(
  { fetch, update },
  async ({ fetch, update }, id: string, params: PatientEditingDto) => {
    return await performTransaction(async (tx: any) => {
      const previousPatient = (await fetch(id)) as unknown as PatientModel
      params.billEnableFlag = isBillEnablePatient(params)
      const tUpdate: typeof update = (update as any).inject({ client: tx })
      const result = await tUpdate(id, params)
      const tFetchPatient: typeof fetch = (fetch as any).inject({ client: tx })
      const latestPatient = (await tFetchPatient(id)) as unknown as PatientModel
      const tCreatePatientChangeHistory: typeof createPatientChangeHistory = (createPatientChangeHistory as any).inject(
        { client: tx },
      )
      const tCreateManyPatientChangeContent: typeof createManyPatientChangeContent = (
        createManyPatientChangeContent as any
      ).inject({ client: tx })
      const { id: patientChangeHistoryId } = await tCreatePatientChangeHistory({ patientId: id, changeType: 'MANUAL' })
      const patientChangeContentList = createPatientChangeContentList(previousPatient, latestPatient)
      if (patientChangeContentList.length === 0) {
        throw new NoContentError()
      }
      await tCreateManyPatientChangeContent(patientChangeHistoryId, patientChangeContentList)
      return result
    })
  },
)

/**
 * 指定患者の関連施設情報を更新します。
 * <pre>
 *  [退去時]
 *  現在所属している施設の退去日を設定します
 *  [転出時]
 *  新たに関連施設を作成します。
 *  患者番号は新規に払い出しし、施設メモは初期化します。
 *  ※転居日が未来を指定している場合は関連施設の作成のみ処理し、その他情報の変更は転居日にバッチ処理されます。
 * </pre>
 * @param id 患者ID
 * @param params 患者情報
 */
export const updatePatientHealthFacility = depend(
  {
    fetch,
    update,
    fetchPatientRelateHealthFacilityByPatient,
    updatePatientRelateHealthFacility,
    updatePatientUpdated,
    createPatientRelateHealthFacility,
    incrementHealthFacilityCodeManageSequenceNo,
    createPatientCodeHistory,
    createPatientChangeHistory,
    createManyPatientChangeContent,
  },
  async (
    {
      fetch,
      update,
      fetchPatientRelateHealthFacilityByPatient,
      updatePatientRelateHealthFacility,
      updatePatientUpdated,
      createPatientRelateHealthFacility,
      incrementHealthFacilityCodeManageSequenceNo,
      createPatientCodeHistory,
      createManyPatientChangeContent,
    },
    id: string,
    params: PatientHealthFacilityEditingDto,
  ) => {
    return await performTransaction(async (tx: any) => {
      const patient = await fetch(id)
      const nowRelateHealthFacility = await fetchPatientRelateHealthFacilityByPatient(
        patient.id,
        patient.healthFacilityId,
      )
      params.patientId = patient.id

      const tUpdatePatientRelateHealthFacility: typeof updatePatientRelateHealthFacility = (
        updatePatientRelateHealthFacility as any
      ).inject({ client: tx })
      const tUpdatePatientUpdated: typeof updatePatientUpdated = (updatePatientUpdated as any).inject({ client: tx })
      // 退出
      if (params.reason === 'DECEASE') {
        params.healthFacilityId = patient.healthFacilityId

        const relateHealthFacilityResult = await tUpdatePatientRelateHealthFacility(nowRelateHealthFacility.id, params)
        await tUpdatePatientUpdated(patient.id)
        // TODO 過去日の場合、すぐに患者ステータスを変更する？
        return relateHealthFacilityResult
      }
      // 転出
      const newHealthFacilityId = params.healthFacilityId
      if (!newHealthFacilityId) throw new Error('患者転出施設ID未設定')
      const tCreatePatientRelateHealthFacility: typeof createPatientRelateHealthFacility = (
        createPatientRelateHealthFacility as any
      ).inject({ client: tx })
      // 既存所属施設の退去日を設定
      if (!params.startDate) throw new Error('患者転出転居日未設定')
      await tUpdatePatientRelateHealthFacility(nowRelateHealthFacility.id, {
        endDate: subDays(params.startDate, 1),
      })
      // TODO 過去日の場合、転出処理を即時に実行
      if (isPast(params.startDate)) {
        // 施設と患者番号の変更
        // [確認]
        // ・患者番号払いだしは施設コード管理のシーケンス番号+1であっている？
        // ・0埋めって前4桁,後ろ4桁どちらも埋めて連結すればいい？
        // ・今の施設コード管理を取得するにはコードで検索すればいい？ つまり施設IDとコードでユニーク?ユニークインデックスを作りたい
        //　※施設IDを指定して最新descで取得すればいいだけか。
        // 施設コード管理のシーケンス番号を+1してかつ値を取得 (lockをかける)
        const tIncrementHealthFacilityCodeManageSequenceNo: typeof incrementHealthFacilityCodeManageSequenceNo = (
          incrementHealthFacilityCodeManageSequenceNo as any
        ).inject({ client: tx })

        const healthFacilityCodeManage = await tIncrementHealthFacilityCodeManageSequenceNo(newHealthFacilityId)
        const newPatientCode = createNewPatientCode(healthFacilityCodeManage)

        const tCreatePatientCodeHistory: typeof createPatientCodeHistory = (createPatientCodeHistory as any).inject({
          client: tx,
        })
        // 患者コード履歴を登録
        await tCreatePatientCodeHistory({
          patientId: patient.id,
          healthFacilityId: newHealthFacilityId,
          patientCode: newPatientCode,
        })
        // コードと施設を最新、施設メモを初期化
        const nowHealthFacilityInfo = patient.healthFacilityInfo
        const tUpdate: typeof update = (update as any).inject({ client: tx })
        patient.healthFacilityId = newHealthFacilityId
        patient.code = newPatientCode
        patient.healthFacilityInfo = null
        await tUpdate(patient.id, patient)
        // TODO 患者関連施設TBLの請求書ソート順を更新(※一覧で並べたいはずなので実装はしてみたい) 基本施設メモでソートなので移動後は最後?
        await tCreatePatientRelateHealthFacility({
          patientId: patient.id,
          healthFacilityId: newHealthFacilityId,
          startDate: params.startDate,
          reason: params.reason,
          note: params.note,
        })
        if (nowHealthFacilityInfo !== null) {
          const tCreatePatientChangeHistory: typeof createPatientChangeHistory = (
            createPatientChangeHistory as any
          ).inject({ client: tx })
          const tCreateManyPatientChangeContent: typeof createManyPatientChangeContent = (
            createManyPatientChangeContent as any
          ).inject({ client: tx })
          const { id: patientChangeHistoryId } = await tCreatePatientChangeHistory({
            patientId: id,
            changeType: 'MANUAL',
          })
          await tCreateManyPatientChangeContent(patientChangeHistoryId, [
            {
              itemKey: 'healthFacilityInfo',
              childItemName: null,
              beforeValue: nowHealthFacilityInfo,
              afterValue: null,
            },
          ])
        }
      }

      return tCreatePatientRelateHealthFacility
    })
  },
)
/**
 * 患者が請求可能か判定します。
 * TODO 暫定仕様で概ね全部そろえばよしとする(期限が過ぎたらNGにするなどは今後必要なのか？送付先は個人だと必須?)
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
  return params.publicExpense != null
}

/**
 * 対象施設の新規患者番号を払い出します。
 */
const createNewPatientCode = (healthFacilityCodeManage: HealthFacilityCodeManageModel) => {
  // 対象施設コードとシーケンス番号を取得
  const { code, sequenceNo, healthFacilityCodeGroup } = healthFacilityCodeManage

  if (healthFacilityCodeGroup?.formatType === 'SIMPLE') {
    return `${code}${sequenceNo}`
  }
  return `${code.padStart(4, '0')}${sequenceNo.toString().padStart(4, '0')}`
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
