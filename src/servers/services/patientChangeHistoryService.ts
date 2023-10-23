import {
  PatientChangeContentCreationDto,
  PatientChangeHistoryQueryDto,
  PatientEditingSchema,
  PatientModel,
} from '@/types'
import { joinString } from '@/core/utils/commonUtil'
import { getGenderValue } from '@/shared/items/gender'
import { formatDate } from '@/core/utils/dateUtil'
import { getInsuranceStatusValue } from '@/shared/items/medicalInsuranceStatus'
import { getMedicalNursingShareValue } from '@/shared/items/medicalNursingShare'
import { getPatientPaymentTypeValue } from '@/shared/items/patientPaymentType'
import { getAccountConfirmStatusValue } from '@/shared/items/accountConfirmStatus'
import depend from '@/core/utils/velona'
import { fetchPagedPatientChangeHistories as fetchPaged } from '@/servers/repositories/patientChangeHistoryRepository'
import { PatientChangeContentModel } from '@/types/models/patientChangeHistory'

// ItemConfig#toDiffvalueに設定可能な diffType simple の関数
type ToSimpleArgsFunction = (key: any) => string
// ItemConfig#toDiffvalueに設定可能な diffType diff の関数
type ToObjectArgsFunction = (args: toValueArgs) => string | ChildItem[] | null

/**
 * 患者情報の各項目の差分を記録する方法を定義したコンフィグ情報です。
 * <pre>
 *
 * </pre>
 */
type ItemDiffConfig = {
  // 患者変更内容項目名。独自の項目を付与する場合はtoDiffValueの定義が必須
  itemKey: keyof typeof PatientEditingSchema.shape | 'deliveryAddress' | 'patientFiles' | 'accountManage'
  // 論理名
  itemName: string
  // 項目値の変更内容表示方法 simple: 値をそのまま表示、diff: 値を差分で表示
  viewType?: 'simple' | 'diff'
  // 差分比較値を作成関数を指定。未指定時はitemKey指定フィールドのDB値をそのまま利用して比較
  toDiffValue?: ToObjectArgsFunction | ToSimpleArgsFunction
  /**
   * toDiffValueで指定した関数の引数のインタフェースタイプを指定
   * <pre>
   *   value=DB値,patient=対象患者として以下のようにcallする。(未指定時はargs)
   * ・args:   toDiffValue(value,patient) とcallする(enumや日付フォーマットなど既存関数に利用)
   * ・object: toDiffValue({value,patient}) とcallする(itemKey専用の関数に利用)
   * </pre>
   */
  toDiffValueArgs?: 'args' | 'object'
}

// 差分が配列時の差分値に利用する要素
type ChildItem = {
  childItemName: string
  childItemValue: string | null
}

// 配列系の差分結果
type ChildItemChangeContent = {
  childItemName: string
  beforeValue: string | null
  afterValue: string | null
}

// 差分値変換関数の引数
type toValueArgs = {
  // 患者情報
  patient: PatientModel
  // 項目名の値
  value?: any
}

/**
 * 送付先を差分用文字列に変換します。
 * @param patient 患者情報
 * @return 送付先の比較内容
 */
const toDeliveryAddress = (args: toValueArgs) => {
  const { patient } = args
  return joinString([
    patient.deliveryPostalCode,
    patient.deliveryAddress1,
    patient.deliveryAddress2,
    patient.deliveryName,
  ])
}

/**
 * 振替口座を差分用文字列に変換します
 * @param args 患者情報
 */
const toAccountManage = (args: toValueArgs) => {
  const { patient } = args
  return patient.accountManage?.name ?? null
}

/**
 * 患者添付ファイル差分内容を取得します。
 * @param args 患者情報
 */
const getFiles = (args: toValueArgs) => {
  const { patient } = args
  const changeFileList: ChildItem[] = []
  for (const patientFile of patient.patientFile ?? []) {
    const childItemName = patientFile.title
    const childItemValue = patientFile.note
    changeFileList.push({ childItemName, childItemValue })
  }
  return changeFileList
}

// 患者差分記録定義
const PATIENT_DIFF_CONFIG: ItemDiffConfig[] = [
  // 基本情報
  { itemKey: 'healthFacilityInfo', itemName: '施設メモ' },
  { itemKey: 'name', itemName: '患者氏名' },
  { itemKey: 'nameKana', itemName: '患者氏名カナ' },
  { itemKey: 'gender', itemName: '性別', toDiffValue: getGenderValue },
  { itemKey: 'birthday', itemName: '生年月日', toDiffValue: formatDate },
  // 送付先
  {
    itemKey: 'deliveryAddress',
    itemName: '送付先住所',
    toDiffValue: toDeliveryAddress,
    toDiffValueArgs: 'object',
    viewType: 'diff',
  },
  { itemKey: 'deliveryTel', itemName: '送付先電話番号' },
  // 請求ステータス
  // [同意書]
  { itemKey: 'consentStatus', itemName: '同意書ステータス' },
  { itemKey: 'consentConfirmDate', itemName: '同意書確認日', toDiffValue: formatDate },
  // [医療保険]
  {
    itemKey: 'medicalInsuranceStatus',
    itemName: '医療保険ステータス',
    toDiffValue: getInsuranceStatusValue,
  },
  { itemKey: 'medicalInsuranceStartDate', itemName: '医療保険適用開始日', toDiffValue: formatDate },
  { itemKey: 'medicalInsuranceEndDate', itemName: '医療保険適用終了日', toDiffValue: formatDate },
  {
    itemKey: 'medicalShare',
    itemName: '医療負担割合',
    toDiffValue: getMedicalNursingShareValue,
    toDiffValueArgs: 'args',
  },
  // [介護保険]
  {
    itemKey: 'nursingInsuranceStatus',
    itemName: '医療保険ステータス',
    toDiffValue: getInsuranceStatusValue,
    toDiffValueArgs: 'args',
  },
  { itemKey: 'nursingInsuranceStartDate', itemName: '医療保険適用開始日', toDiffValue: formatDate },
  { itemKey: 'nursingInsuranceEndDate', itemName: '医療保険適用終了日', toDiffValue: formatDate },
  {
    itemKey: 'nursingShare',
    itemName: '医療負担割合',
    toDiffValue: getMedicalNursingShareValue,
    toDiffValueArgs: 'args',
  },
  // [支払い方法]
  { itemKey: 'paymentType', itemName: '支払方法', toDiffValue: getPatientPaymentTypeValue, toDiffValueArgs: 'args' },
  {
    itemKey: 'accountConfirmStatus',
    itemName: '口座振替確認',
    toDiffValue: getAccountConfirmStatusValue,
    toDiffValueArgs: 'args',
  },
  { itemKey: 'accountManage', itemName: '振替口座', toDiffValue: toAccountManage, toDiffValueArgs: 'object' },
  // 備考
  { itemKey: 'note', itemName: '備考', viewType: 'diff' },
  // 添付ファイル
  { itemKey: 'patientFiles', itemName: '添付ファイル', toDiffValue: getFiles, toDiffValueArgs: 'object' },
]

// 配列タイプの項目の差分結果を取得
const generatePatientDiffList = (previousChildItemList: ChildItem[], latestChildItemList: ChildItem[]) => {
  const diffList: ChildItemChangeContent[] = []
  // 追加を特定
  latestChildItemList
    .filter((latest) => previousChildItemList.some((previous) => latest.childItemName !== previous.childItemName))
    .forEach((addedItem) => {
      diffList.push({ childItemName: addedItem.childItemName, beforeValue: null, afterValue: addedItem.childItemValue })
    })

  // 変更を特定
  for (const latestChildItem of latestChildItemList) {
    const previousChangedItem = previousChildItemList.find(
      (previousChildItem) =>
        latestChildItem.childItemName === previousChildItem.childItemName &&
        latestChildItem.childItemValue !== previousChildItem.childItemValue,
    )
    diffList.push({
      childItemName: latestChildItem.childItemName,
      beforeValue: previousChangedItem?.childItemValue ?? null,
      afterValue: latestChildItem.childItemValue,
    })
  }

  // 削除を特定
  previousChildItemList
    .filter((previous) => latestChildItemList.some((latest) => latest.childItemName !== previous.childItemName))
    .forEach((deletedItem) => {
      diffList.push({
        childItemName: deletedItem.childItemName,
        beforeValue: deletedItem.childItemValue,
        afterValue: null,
      })
    })
  return diffList
}

/**
 * 差分用の値を取得します。
 * @param diffConfig
 * @param patient
 */
const getDiffValue = (diffConfig: ItemDiffConfig, patient: PatientModel) => {
  const value = (patient as any)[diffConfig.itemKey]
  if (!(diffConfig.toDiffValue instanceof Function)) return value
  return diffConfig.toDiffValueArgs === 'object'
    ? diffConfig.toDiffValue({ value: value, patient: patient }) ?? null
    : diffConfig.toDiffValue(value) ?? null
}

/**
 * 患者変更内容を作成します。
 *
 * @param previousPatient 変更前患者情報
 * @param latestPatient   変更後患者情報
 */
export const createPatientChangeContentList = (previousPatient: PatientModel, latestPatient: PatientModel) => {
  const changedList: PatientChangeContentCreationDto[] = []
  for (const diffConfig of PATIENT_DIFF_CONFIG) {
    const previousDiffValue = getDiffValue(diffConfig, previousPatient)
    const latestDiffValue = getDiffValue(diffConfig, latestPatient)

    // console.log(diffConfig.itemKey, previousDiffValue, ' / ', latestDiffValue)
    if (Array.isArray(previousDiffValue) && Array.isArray(latestDiffValue)) {
      const changedArrayItemList = generatePatientDiffList(previousDiffValue, latestDiffValue)
      for (const changedArrayItem of changedArrayItemList) {
        changedList.push({
          itemKey: diffConfig.itemKey,
          childItemName: changedArrayItem.childItemName,
          beforeValue: previousDiffValue?.toString() ?? null,
          afterValue: latestDiffValue?.toString() ?? null,
        })
      }
    } else {
      if (previousDiffValue !== latestDiffValue) {
        changedList.push({
          itemKey: diffConfig.itemKey,
          childItemName: null,
          beforeValue: previousDiffValue?.toString() ?? null,
          afterValue: latestDiffValue?.toString() ?? null,
        })
      }
    }
  }
  // console.log('[changedList]', changedList)
  return changedList
}

/**
 * 患者変更内容の差分種別を取得します。
 * @param patientChangeContentModel 患者変更内容
 * @return 差分種別
 */
const getDiffType = (patientChangeContentModel: PatientChangeContentModel) => {
  if (patientChangeContentModel.beforeValue == null || patientChangeContentModel.beforeValue === '') return 'added'
  if (patientChangeContentModel.afterValue == null || patientChangeContentModel.afterValue === '') return 'deleted'
  return 'changed'
}

/**
 * 患者変更履歴のページング検索を実地します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedPatientChangeHistories = depend(
  { fetchPaged },
  async ({ fetchPaged }, params: PatientChangeHistoryQueryDto) => {
    const pagedEntities = await fetchPaged(params)
    // 論理名、差分表示方法、差分種別を付与
    pagedEntities.items.forEach((createPatientChangeHistory) => {
      const patientChangeContents = createPatientChangeHistory.patientChangeContent
      patientChangeContents.forEach((patientChangeContent) => {
        const itemConfig = PATIENT_DIFF_CONFIG.find((config) => config.itemKey === patientChangeContent.itemKey)
        if (!itemConfig)
          throw new Error(
            `患者変更内容 ${patientChangeContent.itemKey} に対するitemNameが見つかりません。PATIENT_DIFF_CONFIG定義内容を確認してください`,
          )
        patientChangeContent.itemName = itemConfig.itemName
        patientChangeContent.viewType = itemConfig.viewType ?? 'simple'
        patientChangeContent.diffType = getDiffType(patientChangeContent)
      })
    })
    return pagedEntities
  },
)
