/******************************************************************************
 *
 *  患者データ移行ツール用の型定義
 *
 ******************************************************************************/

import {
  Company,
  HealthFacility,
  HealthFacilityCodeManage,
  HealthFacilityRelatePharmacy,
  PatientAccountConfirmStatus,
  PatientConsentStatus,
  PatientGender,
  PatientMedicalInsuranceStatus,
  PatientMedicalShare,
  PatientNursingInsuranceStatus,
  PatientPaymentType,
  PatientRelateHealthFacilityReason,
  PatientStatus,
  Pharmacy,
} from '@prisma/client'

/**
 * 薬局取得データ
 */
export type PharmacyData = Pharmacy & { company: Company }

/**
 * 施設取得データ
 */
export type FaciltyData = HealthFacility & { healthFacilityCodeManage: HealthFacilityCodeManage[] }

/**
 * 施設関連店舗取得データ
 */
export type FacilityRelateData = HealthFacilityRelatePharmacy & { pharmacy: Pharmacy; healthFacility: HealthFacility }

/**
 * 患者一時情報
 */
export type TmpPatientModel = {
  // 患者コード（得意先CD）
  patientCode: string
  // 患者氏名（得意先名）
  patientName: string
  // 患者カナ（得意先名カナ）
  patientKana: string
  // 生年月日（請求CSVより）
  birthDate?: Date
  // 性別（請求CSVより）
  gender?: PatientGender
  // 請求先氏名（送付先宛名）
  billName: string
  // 患者トリム氏名（得意先名からスペース（半角・全角）を取り除いた値）
  trimName: string
  // 郵便番号（郵便番号）
  postalCode: string
  // 住所1（住所1）
  address1: string
  // 住所2（住所2）
  address2: string
  // 電話番号（TEL1）
  tel: string
  // （部門CD）
  deptCode: string
  // （部門名）
  deptName: string
  // 薬局ID（部門CDと部門名を初期データに紐づけたマッピング情報から取得）
  pharmacyId: string
  // 施設コードグループID（薬局の会社が持つIDを設定）
  healthFacilityCodeGroupId: string
  // 施設コード（施設CD）
  healthFacilityCode: string
  // 施設コード（施設名）
  healthFacilityName: string
  // 施設ID（施設CDと施設コードグループIDを元に施設コード管理から取得）
  healthFacilityId: string
  // 支払い種別（分類CD3の値を enum 値に変換して設定）
  paymentType: PatientPaymentType
  // ソート項目（最終請求締年月日）
  lastBillDate: Date | null
  // 同意書確認（同意書CDが「1:有」の場合にtrueを設定）
  consentConfirm: boolean
  // 保険書確認（保険書CDが「1:有」の場合にtrueを設定）
  insuranceConfirm: boolean
  // 口座振替確認状態（分類CD4の値を enum 値に変換して設定）
  accountConfirmStatus: PatientAccountConfirmStatus | null
  // 口座管理ID
  accountManageId: string
  // 備考
  note: string
  // 申し送り
  comment: string
  // 非有効（申し送りに「逝去」「退居（退去）」の文字列があれば true を設定）
  notActive: boolean
  // 患者コードから施設コードを削除して数値化したシーケンス番号
  seqNo: number
}

/**
 * 共通カラム
 */
export type CommonColumns = {
  createdAt?: Date
  createdBy?: string
  updatedAt?: Date
  updatedBy?: string
  deletedAt?: Date
}

/**
 * 患者登録情報
 */
export type PatientInputModel = {
  id: string
  healthFacilityId: string
  code: string
  status: PatientStatus
  name: string
  nameKana: string
  searchName: string
  gender: PatientGender
  birthday: Date | null
  billEnableFlag: boolean
  medicalInsuranceStatus: PatientMedicalInsuranceStatus
  medicalInsuranceStartDate?: Date
  medicalInsuranceEndDate?: Date
  medicalShareConfirmDate: Date | null
  medicalShare?: PatientMedicalShare
  nursingInsuranceStatus: PatientNursingInsuranceStatus
  nursingInsuranceStartDate?: Date
  nursingInsuranceEndDate?: Date
  nursingShareConfirmDate: Date | null
  nursingShare?: PatientMedicalShare
  publicExpense: boolean | null
  consentStatus: PatientConsentStatus
  consentConfirmDate?: Date
  paymentType: PatientPaymentType
  accountConfirmStatus: PatientAccountConfirmStatus | null
  accountManageId: string | null
  receiptSyncFlag: boolean
  deliveryName: string | null
  deliveryPostalCode: string | null
  deliveryAddress1: string | null
  deliveryAddress2: string | null
  deliveryTel: string | null
  healthFacilityInfo: string | null
  note: string | null
  patientRelateHealthFacility?: PatientRelateHealthFacilityInputModel[]
  tempLastBillDate?: Date | null
} & CommonColumns

/**
 * 患者関連施設登録情報
 */
export type PatientRelateHealthFacilityInputModel = {
  id: string
  patientId: string
  healthFacilityId: string
  patientCode: string
  startDate: Date
  endDate: Date
  reason?: PatientRelateHealthFacilityReason
  createdAt?: Date
  createdBy?: string
  updatedAt?: Date
  updatedBy?: string
  deletedAt?: Date
} & CommonColumns
