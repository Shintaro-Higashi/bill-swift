import { PatientChangeContent, PatientChangeHistory } from '@prisma/client'
import { CommonRelateUserModel } from '@/types/models/commonRelateUserModel'

// 患者変更履歴Entity
export type PatientChangeHistoryModel = PatientChangeHistory &
  CommonRelateUserModel & {
    patientChangeContent: PatientChangeContentModel[]
  }

// 患者変更詳細Entity
export type PatientChangeContentModel = PatientChangeContent & {
  // 差分種別 追加 / 変更 / 削除
  diffType?: 'added' | 'changed' | 'deleted'
  // 項目名
  itemName?: string
  /**
   * 差分内容の表示方法
   * ・simple: `AAA` から `BBB` に変更 と表示
   * ・diff: Diff形式で表示
   */
  viewType?: 'simple' | 'diff'
}
