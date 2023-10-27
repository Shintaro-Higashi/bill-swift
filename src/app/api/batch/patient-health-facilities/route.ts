import { NextRequest, NextResponse } from 'next/server'
import { performRequest } from '@/core/utils/requestUtil'
import { executeScheduledPatientRelateHealthFacilityTasks } from '@/servers/services/patientRelateHealthFacilityScheduleService'

/**
 * 患者関連施設の予約変更を処理するバッチ疑似APIです。
 */
export async function GET(_req: NextRequest) {
  return await performRequest(async () => {
    // 予約処理が必要な関連施設情報を取得
    await executeScheduledPatientRelateHealthFacilityTasks()
    return NextResponse.json({ ok: true })
  })
}
