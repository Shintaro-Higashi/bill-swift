import { PatientHealthFacilityEditingDto } from '@/types'
import {
  fetchPatient as fetch,
  updatePatient as update,
  updatePatientUpdated,
} from '@/servers/repositories/patientRepository'
import {
  createPatientRelateHealthFacility,
  fetchPatientRelateHealthFacility,
  fetchPatientRelateHealthFacilitiesByPatientId,
  fetchPatientRelateHealthFacilityByUnique,
  updatePatientRelateHealthFacility,
  deletePatientRelateHealthFacility,
} from '@/servers/repositories/patientRelateHealthFacilityRepository'
import { createPatientChangeHistory } from '@/servers/repositories/patientChangeHistoryRepository'
import { createManyPatientChangeContent } from '@/servers/repositories/patientChangeContentRepository'
import depend from '@/core/utils/velona'
import { injectTx, performTransaction } from '@/servers/repositories/performTransaction'
import { isPast, subDays } from 'date-fns'
import { incrementHealthFacilityCodeManageSequenceNo } from '@/servers/repositories/healthFacilityCodeManageRepository'
import { createNewPatientCode } from '@/servers/services/patientService'
import { getEndMaxDate, toJSTDate } from '@/core/utils/dateUtil'
import { iChangeHealthFacilityDeceaseExitReason } from '@/shared/services/patientRelateHealthFacilityService'

/**
 * 指定の患者IDに該当する患者関連施設情報を最新順に取得します。
 * @param id 患者ID
 * @return 患者関連施設情報
 */
export const fetchPatientHealthFacility = depend(
  { fetchPatientRelateHealthFacilitiesByPatientId },
  async ({ fetchPatientRelateHealthFacilitiesByPatientId }, id: string) => {
    return await fetchPatientRelateHealthFacilitiesByPatientId(id)
  },
)

/**
 * 指定患者の関連施設情報を登録、または更新します。
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
export const upsertPatientHealthFacility = depend(
  {
    fetch,
    update,
    fetchPatientRelateHealthFacilityByUnique,
    updatePatientRelateHealthFacility,
    updatePatientUpdated,
    createPatientRelateHealthFacility,
    incrementHealthFacilityCodeManageSequenceNo,
    createPatientChangeHistory,
    createManyPatientChangeContent,
  },
  async (
    {
      fetch,
      update,
      fetchPatientRelateHealthFacilityByUnique,
      updatePatientRelateHealthFacility,
      updatePatientUpdated,
      createPatientRelateHealthFacility,
      incrementHealthFacilityCodeManageSequenceNo,
      createManyPatientChangeContent,
    },
    id: string,
    params: PatientHealthFacilityEditingDto,
  ) => {
    return await performTransaction(async (tx: any) => {
      const patient = await fetch(id)
      const nowRelateHealthFacility = await fetchPatientRelateHealthFacilityByUnique(
        patient.id,
        patient.healthFacilityId,
        patient.code,
      )
      params.patientId = patient.id

      const tUpdate = injectTx(update, tx)
      const tUpdatePatientRelateHealthFacility = injectTx(updatePatientRelateHealthFacility, tx)
      const tUpdatePatientUpdated = injectTx(updatePatientUpdated, tx)

      await tUpdatePatientUpdated(patient.id)
      // [逝去、退去]
      if (params.reason === 'DECEASE' || params.reason === 'EXIT') {
        if (!params.endDate) throw new Error('患者逝去、退去日未設定')

        params.healthFacilityId = patient.healthFacilityId

        const relateHealthFacilityResult = await tUpdatePatientRelateHealthFacility(nowRelateHealthFacility.id, params)
        if (isPast(params.endDate)) {
          await tUpdate(patient.id, { ...patient, ...{ status: params.reason } })
        }
        return relateHealthFacilityResult
      }
      // [転出]
      const newHealthFacilityId = params.healthFacilityId
      if (!newHealthFacilityId) throw new Error('患者転出施設ID未設定')
      const tCreatePatientRelateHealthFacility = injectTx(createPatientRelateHealthFacility, tx)
      // 既存所属施設の退去日を設定
      if (!params.startDate) throw new Error('患者転出転居日未設定')
      await tUpdatePatientRelateHealthFacility(nowRelateHealthFacility.id, {
        reason: params.reason,
        endDate: subDays(params.startDate, 1),
      })

      const tIncrementHealthFacilityCodeManageSequenceNo = injectTx(incrementHealthFacilityCodeManageSequenceNo, tx)
      const healthFacilityCodeManage = await tIncrementHealthFacilityCodeManageSequenceNo(newHealthFacilityId)
      const newPatientCode = createNewPatientCode(healthFacilityCodeManage)
      await tCreatePatientRelateHealthFacility({
        patientId: patient.id,
        healthFacilityId: newHealthFacilityId,
        patientCode: newPatientCode,
        startDate: params.startDate,
        reason: null,
        note: params.note,
      })
      if (isPast(params.startDate)) {
        // TODO 過去日の場合、転出処理を即時に実行
        // コードと施設を最新、施設メモを初期化
        const nowHealthFacilityInfo = patient.healthFacilityInfo
        patient.healthFacilityId = newHealthFacilityId
        patient.code = newPatientCode
        patient.healthFacilityInfo = null
        await tUpdate(patient.id, patient)
        // TODO 患者関連施設TBLの請求書ソート順を更新(※一覧で並べたいはずなので実装はしておきたい) 基本施設メモでソートなので移動後は最後?
        if (nowHealthFacilityInfo !== null) {
          const tCreatePatientChangeHistory = injectTx(createPatientChangeHistory, tx)
          const tCreateManyPatientChangeContent = injectTx(createManyPatientChangeContent, tx)
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
 * 指定患者の関連施設情報を更新します。
 *
 * @param patientRelateHealthFacilityId 患者関連施設ID
 * @param params 患者関連施設更新情報
 */
export const updatePatientHealthFacility = depend(
  {
    fetchPatientRelateHealthFacility,
    updatePatientRelateHealthFacility,
    updatePatientUpdated,
  },
  async (
    { fetchPatientRelateHealthFacility, updatePatientRelateHealthFacility, updatePatientUpdated },
    patientRelateHealthFacilityId: string,
    params: PatientHealthFacilityEditingDto,
  ) => {
    return await performTransaction(async (tx: any) => {
      const tUpdatePatientRelateHealthFacility = injectTx(updatePatientRelateHealthFacility, tx)
      const tUpdatePatientUpdated = injectTx(updatePatientUpdated, tx)

      const patientRelateHealthFacility = await fetchPatientRelateHealthFacility(patientRelateHealthFacilityId)

      params.reason = patientRelateHealthFacility.reason
      // TODO reasonに応じて値更新させないような処理

      const result = await tUpdatePatientRelateHealthFacility(patientRelateHealthFacilityId, params)
      await tUpdatePatientUpdated(patientRelateHealthFacility.patientId)

      return result
    })
  },
)

/**
 * 指定患者の関連施設情報予約を取消します。
 * <pre>
 *  入居処理、または退去処理がまだ完了していない関連施設のみ削除可能です。
 * </pre>
 * @param patientRelateHealthFacilityId 患者関連施設ID
 * @param params 患者関連施設更新情報
 */
export const cancelFuturePatientHealthFacility = depend(
  {
    fetchPatientRelateHealthFacility,
    fetchPatientRelateHealthFacilitiesByPatientId,
    updatePatientRelateHealthFacility,
    deletePatientRelateHealthFacility,
    updatePatientUpdated,
  },
  async (
    {
      fetchPatientRelateHealthFacility,
      fetchPatientRelateHealthFacilitiesByPatientId,
      updatePatientRelateHealthFacility,
      deletePatientRelateHealthFacility,
      updatePatientUpdated,
    },
    patientRelateHealthFacilityId: string,
  ) => {
    return await performTransaction(async (tx: any) => {
      const tDeletePatientRelateHealthFacility = injectTx(deletePatientRelateHealthFacility, tx)
      const tUpdatePatientRelateHealthFacility = injectTx(updatePatientRelateHealthFacility, tx)
      const tUpdatePatientUpdated = injectTx(updatePatientUpdated, tx)

      const patientRelateHealthFacility = await fetchPatientRelateHealthFacility(patientRelateHealthFacilityId)
      // TODO 削除可能か判定
      // 施設変更取消時:一つ前のreasonと退去日を差し戻し、自身も削除
      if (patientRelateHealthFacility.reason === null) {
        const relateHealthFacilities = await fetchPatientRelateHealthFacilitiesByPatientId(
          patientRelateHealthFacility.patientId,
        )
        const prevRelateHealthFacilities = relateHealthFacilities[1]
        prevRelateHealthFacilities.reason = null
        prevRelateHealthFacilities.endDate = getEndMaxDate()
        await tUpdatePatientRelateHealthFacility(prevRelateHealthFacilities.id, prevRelateHealthFacilities)
        await tDeletePatientRelateHealthFacility(patientRelateHealthFacilityId)
      } else if (iChangeHealthFacilityDeceaseExitReason(patientRelateHealthFacility.reason)) {
        // 退出取消時: 自身のreason と退出日を初期化
        patientRelateHealthFacility.reason = null
        patientRelateHealthFacility.endDate = getEndMaxDate()
        await tUpdatePatientRelateHealthFacility(patientRelateHealthFacilityId, patientRelateHealthFacility)
      }

      const result = await tUpdatePatientUpdated(patientRelateHealthFacility.patientId)
      return result
    })
  },
)
