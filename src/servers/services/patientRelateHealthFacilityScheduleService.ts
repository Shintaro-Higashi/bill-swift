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

type TasksResult = {
  // 成功件数
  successfulTaskCount: number
  // エラー件数
  errorTaskCount: number
}

/**
 * 患者所属施設変更スケジュールタスクを処理します。
 * @param id 患者ID
 * @return タスク処理結果
 */
export const executeRequiredChangePatientHealthFacilityTasks = depend(
  { fetchRequiredAffiliationChangeFacilities },
  async ({ fetchRequiredAffiliationChangeFacilities }): Promise<TasksResult> => {
    const awaitChangeHealthFacilityList = await fetchRequiredAffiliationChangeFacilities(getCurrentDate())
    loggerInfo(
      `executeRequiredChangePatientHealthFacilityTasks:start:${awaitChangeHealthFacilityList.length} 名の患者施設変更開始`,
    )
    let successfulTaskCount = 0
    let errorTaskCount = 0
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
        successfulTaskCount++
        loggerInfo(`患者ID ${awaitChangeHealthFacility.patientId} の施設変更が完了しました`)
      } catch (e) {
        errorTaskCount++
        loggerError(`患者ID ${awaitChangeHealthFacility.patientId} の施設変更に失敗しました`, { error: e })
      }
    }
    loggerInfo(
      `executeRequiredChangePatientHealthFacilityTasks:end:${awaitChangeHealthFacilityList.length} 件中 成功${successfulTaskCount}件、失敗${errorTaskCount}件`,
    )
    return { successfulTaskCount, errorTaskCount }
  },
)

/**
 * 患者ステータス変更(逝去・退出)スケジュールタスクを処理します。
 * @param id 患者ID
 * @return タスク処理結果
 */
export const executeRequiredChangePatientStatusTasks = depend(
  { fetchRequiredChangeStatusPatientRelateHealthFacilities, updatePatient },
  async ({ fetchRequiredChangeStatusPatientRelateHealthFacilities, updatePatient }): Promise<TasksResult> => {
    const awaitChangePatientStatusList = await fetchRequiredChangeStatusPatientRelateHealthFacilities(getCurrentDate())
    loggerInfo(
      `executeRequiredChangePatientStatusTasks:start:${awaitChangePatientStatusList.length} 名の患者ステータス変更開始`,
    )
    let successfulTaskCount = 0
    let errorTaskCount = 0
    for (const awaitChangePatientStatus of awaitChangePatientStatusList) {
      try {
        // 患者都度コミット
        await performTransaction(async (tx: any) => {
          const { patient } = awaitChangePatientStatus
          if (!patient) throw new Error('患者ステータス退出変更タスク実行に必要な患者情報がありません')
          const patientStatus = toPatientStatusByHealthFacilityReason(awaitChangePatientStatus.reason)
          await injectTx(updatePatient, tx)(patient.id, { ...patient, ...{ status: patientStatus } })
        })
        successfulTaskCount++
        loggerInfo(`患者ID ${awaitChangePatientStatus.patientId} のステータス変更が完了しました`)
      } catch (e) {
        errorTaskCount++
        loggerError(`患者ID ${awaitChangePatientStatus.patientId} のステータス変更に失敗しました`)
      }
    }
    loggerInfo(
      `executeRequiredChangePatientStatusTasks:end:${awaitChangePatientStatusList.length} 件中 成功${successfulTaskCount}件、失敗${errorTaskCount}件`,
    )
    return { successfulTaskCount, errorTaskCount }
  },
)
