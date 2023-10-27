import {
  fetchRequiredAffiliationChangeFacilities,
  fetchRequiredChangeStatusPatientRelateHealthFacilities,
} from '@/servers/repositories/patientRelateHealthFacilityRepository'
import depend from '@/core/utils/velona'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { logInfo } from '@/core/configs/log'

/**
 * 予約変更患者関連施設のスケジュールタスクを処理します。
 * @param id 患者ID
 * @return 患者関連施設情報
 */
export const executeScheduledPatientRelateHealthFacilityTasks = depend(
  { fetchRequiredAffiliationChangeFacilities, fetchRequiredChangeStatusPatientRelateHealthFacilities },
  async ({ fetchRequiredAffiliationChangeFacilities, fetchRequiredChangeStatusPatientRelateHealthFacilities }) => {
    const awaitChangeHealthFacilityList = await fetchRequiredAffiliationChangeFacilities(getCurrentDate())
    console.log('施設変更待', awaitChangeHealthFacilityList)

    // const awaitChangePatientStatusList = await fetchRequiredChangeStatusPatientRelateHealthFacilities(getCurrentDate())
    // console.log('患者ステータス変更待', awaitChangePatientStatusList)
  },
)
