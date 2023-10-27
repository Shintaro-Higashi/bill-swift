import { NextRequest, NextResponse } from 'next/server'
import { performRequest } from '@/core/utils/requestUtil'
import {
  executeRequiredChangePatientHealthFacilityTasks,
  executeRequiredChangePatientStatusTasks,
} from '@/servers/services/patientRelateHealthFacilityScheduleService'

/**
 * 患者関連施設の予約変更を処理するバッチ疑似APIです。
 */
export async function GET(_req: NextRequest) {
  return await performRequest(async () => {
    // TODO 更新者ユーザID取得はAPIと異なるため対応が必要
    // 患者施設の変更
    const changeFacilityResult = await executeRequiredChangePatientHealthFacilityTasks()
    // 患者ステータスの変更
    const changeStatusResult = await executeRequiredChangePatientStatusTasks()
    return NextResponse.json({
      changeFacilityResult: { ...changeFacilityResult },
      changeStatusResult: { ...changeStatusResult },
    })
  })
}
