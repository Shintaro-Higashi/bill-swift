import {
  fetchRequiredAffiliationChangeFacilities,
  fetchRequiredChangeStatusPatientRelateHealthFacilities,
} from '@/servers/repositories/patientRelateHealthFacilityRepository'
import depend from '@/core/utils/velona'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { changePatientHealthFacility } from '@/servers/services/patientRelateHealthFacilityService'
import { injectTx, performTransaction } from '../repositories/performTransaction'
import { updatePatient } from '@/servers/repositories/patientRepository'
import { createPatientChangeHistory } from '@/servers/repositories/patientChangeHistoryRepository'
import { createManyPatientChangeContent } from '@/servers/repositories/patientChangeContentRepository'
import { loggerError, loggerInfo } from '@/core/configs/log'
import { toPatientStatusByHealthFacilityReason } from '@/shared/services/patientRelateHealthFacilityService'

/**
 * 患者所属施設変更スケジュールタスクを処理します。
 * @param id 患者ID
 * @return 患者関連施設情報
 */
export const executeRequiredChangePatientHealthFacilityTasks = depend(
  { fetchRequiredAffiliationChangeFacilities },
  async ({ fetchRequiredAffiliationChangeFacilities }) => {
    const awaitChangeHealthFacilityList = await fetchRequiredAffiliationChangeFacilities(getCurrentDate())
    loggerInfo(
      `executeRequiredChangePatientHealthFacilityTasks:start:${awaitChangeHealthFacilityList.length} 名の患者施設変更開始`,
    )
    let success = 0
    let error = 0
    for (const awaitChangeHealthFacility of awaitChangeHealthFacilityList) {
      try {
        // 患者都度コミット
        await performTransaction(async (tx: any) => {
          if (!awaitChangeHealthFacility.patient) throw new Error('施設変更タスク実行に必要な患者情報がありません')
          await changePatientHealthFacility.inject({
            update: injectTx(updatePatient, tx),
            createPatientChangeHistory: injectTx(createPatientChangeHistory, tx),
            createManyPatientChangeContent: injectTx(createManyPatientChangeContent, tx),
          })(awaitChangeHealthFacility.patient, awaitChangeHealthFacility)
        })
        success++
        loggerInfo(`患者ID ${awaitChangeHealthFacility.patientId} の施設変更が完了しました`)
      } catch (e) {
        error++
        loggerError(`患者ID ${awaitChangeHealthFacility.patientId} の施設変更に失敗しました`)
      }
    }
    loggerInfo(
      `executeRequiredChangePatientHealthFacilityTasks:end:${awaitChangeHealthFacilityList.length} 件中 成功${success}件、失敗${error}件`,
    )
    return { success, error }
  },
)

/**
 * 患者ステータス変更(逝去・退出)スケジュールタスクを処理します。
 * @param id 患者ID
 * @return 患者関連施設情報
 */
export const executeRequiredChangePatientStatusTasks = depend(
  { fetchRequiredChangeStatusPatientRelateHealthFacilities, updatePatient },
  async ({ fetchRequiredChangeStatusPatientRelateHealthFacilities, updatePatient }) => {
    const awaitChangePatientStatusList = await fetchRequiredChangeStatusPatientRelateHealthFacilities(getCurrentDate())
    loggerInfo(
      `executeRequiredChangePatientStatusTasks:start:${awaitChangePatientStatusList.length} 名の患者ステータス変更開始`,
    )
    let success = 0
    let error = 0
    for (const awaitChangePatientStatus of awaitChangePatientStatusList) {
      try {
        // 患者都度コミット
        await performTransaction(async (tx: any) => {
          const { patient } = awaitChangePatientStatus
          if (!patient) throw new Error('患者ステータス退出変更タスク実行に必要な患者情報がありません')
          const patientStatus = toPatientStatusByHealthFacilityReason(awaitChangePatientStatus.reason)
          await injectTx(updatePatient, tx)(patient.id, { ...patient, ...{ status: patientStatus } })
        })
        success++
        loggerInfo(`患者ID ${awaitChangePatientStatus.patientId} のステータス変更が完了しました`)
      } catch (e) {
        error++
        loggerError(`患者ID ${awaitChangePatientStatus.patientId} のステータス変更に失敗しました`)
      }
    }
    loggerInfo(
      `executeRequiredChangePatientStatusTasks:end:${awaitChangePatientStatusList.length} 件中 成功${success}件、失敗${error}件`,
    )
    return { success, error }
  },
)
