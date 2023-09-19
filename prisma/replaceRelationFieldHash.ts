/**
 * replaceRelationFieldで利用する置換ルールです
 */
const replacements: { search: string; replace: string }[] = [
  // 施設コードグループ
  { search: 'userHealthFacilityCodeGroupCreatedByTouser', replace: 'createdUser' },
  { search: 'userHealthFacilityCodeGroupUpdatedByTouser', replace: 'updatedUser' },
  // 会社
  { search: 'userCompanyCreatedByTouser', replace: 'createdUser' },
  { search: 'userCompanyUpdatedByTouser', replace: 'updatedUser' },
  // 薬局グループ
  { search: 'userPharmacyGroupCreatedByTouser', replace: 'createdUser' },
  { search: 'userPharmacyGroupUpdatedByTouser', replace: 'updatedUser' },
  // 薬局
  { search: 'userPharmacyCreatedByTouser', replace: 'createdUser' },
  { search: 'userPharmacyUpdatedByTouser', replace: 'updatedUser' },
  // 薬局基本調剤設定
  { search: 'userPharmacyBaseCompoundingSettingCreatedByTouser', replace: 'createdUser' },
  { search: 'userPharmacyBaseCompoundingSettingUpdatedByTouser', replace: 'updatedUser' },
  // 施設
  { search: 'userHealthFacilityCreatedByTouser', replace: 'createdUser' },
  { search: 'userHealthFacilityUpdatedByTouser', replace: 'updatedUser' },
  // 施設コード管理
  { search: 'userHealthFacilityCodeManageCreatedByTouser', replace: 'createdUser' },
  { search: 'userHealthFacilityCodeManageUpdatedByTouser', replace: 'updatedUser' },
  // 施設関連薬局
  { search: 'userHealthFacilityRelatePharmacyCreatedByTouser', replace: 'createdUser' },
  { search: 'userHealthFacilityRelatePharmacyUpdatedByTouser', replace: 'updatedUser' },
  // 患者
  { search: 'userPatientCreatedByTouser', replace: 'createdUser' },
  { search: 'userPatientUpdatedByTouser', replace: 'updatedUser' },
  // 患者関連施設
  { search: 'userPatientRelateHealthFacilityCreatedByTouser', replace: 'createdUser' },
  { search: 'userPatientRelateHealthFacilityUpdatedByTouser', replace: 'updatedUser' },
  // 患者変更内容
  { search: 'userPatientChangeContentCreatedByTouser', replace: 'createdUser' },
  { search: 'userPatientChangeContentUpdatedByTouser', replace: 'updatedUser' },
  // 患者変更履歴
  { search: 'userPatientChangeHistoryCreatedByTouser', replace: 'createdUser' },
  { search: 'userPatientChangeHistoryUpdatedByTouser', replace: 'updatedUser' },
  // 患者コード履歴
  { search: 'userPatientCodeHistoryCreatedByTouser', replace: 'createdUser' },
  { search: 'userPatientCodeHistoryUpdatedByTouser', replace: 'updatedUser' },
  // 患者ファイル
  { search: 'userPatientFileCreatedByTouser', replace: 'createdUser' },
  { search: 'userPatientFileUpdatedByTouser', replace: 'updatedUser' },
  // 問い合わせ
  { search: 'userInquiryCreatedByTouser', replace: 'createdUser' },
  { search: 'userInquiryUpdatedByTouser', replace: 'updatedUser' },
  // 問い合わせ応答
  { search: 'userInquiryCorrespondCreatedByTouser', replace: 'createdUser' },
  { search: 'userInquiryCorrespondUpdatedByTouser', replace: 'updatedUser' },
  // 問い合わせファイル
  { search: 'userInquiryFileCreatedByTouser', replace: 'createdUser' },
  { search: 'userInquiryFileUpdatedByTouser', replace: 'updatedUser' },
  // ユーザ
  { search: 'healthFacilityCodeGroupHealthFacilityCodeGroupCreatedByTouser', replace: 'healthFacilityCodeGroupCreatedUser' },
  { search: 'healthFacilityCodeGroupHealthFacilityCodeGroupUpdatedByTouser', replace: 'healthFacilityCodeGroupUpdatedUser' },
  { search: 'companyCompanyCreatedByTouser', replace: 'companyCreatedUser' },
  { search: 'companyCompanyUpdatedByTouser', replace: 'companyUpdatedUser' },
  { search: 'pharmacyGroupPharmacyGroupCreatedByTouser', replace: 'pharmacyGroupCreatedUser' },
  { search: 'pharmacyGroupPharmacyGroupUpdatedByTouser', replace: 'pharmacyGroupUpdatedUser' },
  { search: 'pharmacyPharmacyCreatedByTouser', replace: 'pharmacyCreatedUser' },
  { search: 'pharmacyPharmacyUpdatedByTouser', replace: 'pharmacyUpdatedUser' },
  { search: 'pharmacyBaseCompoundingSettingPharmacyBaseCompoundingSettingCreatedByTouser', replace: 'pharmacyBaseCompoundingSettingCreatedUser' },
  { search: 'pharmacyBaseCompoundingSettingPharmacyBaseCompoundingSettingUpdatedByTouser', replace: 'pharmacyBaseCompoundingSettingUpdatedUser' },
  { search: 'healthFacilityHealthFacilityCreatedByTouser', replace: 'healthFacilityCreatedUser' },
  { search: 'healthFacilityHealthFacilityUpdatedByTouser', replace: 'healthFacilityUpdatedUser' },
  { search: 'healthFacilityCodeManageHealthFacilityCodeManageCreatedByTouser', replace: 'healthFacilityCodeManageCreatedUser' },
  { search: 'healthFacilityCodeManageHealthFacilityCodeManageUpdatedByTouser', replace: 'healthFacilityCodeManageUpdatedUser' },
  { search: 'healthFacilityRelatePharmacyHealthFacilityRelatePharmacyCreatedByTouser', replace: 'healthFacilityRelatePharmacyCreatedUser' },
  { search: 'healthFacilityRelatePharmacyHealthFacilityRelatePharmacyUpdatedByTouser', replace: 'healthFacilityRelatePharmacyUpdatedUser' },
  { search: 'patientRelateHealthFacilityPatientRelateHealthFacilityCreatedByTouser', replace: 'patientRelateHealthFacilityCreatedUser' },
  { search: 'patientRelateHealthFacilityPatientRelateHealthFacilityUpdatedByTouser', replace: 'patientRelateHealthFacilityUpdatedUser' },
  { search: 'patientPatientCreatedByTouser', replace: 'patientCreatedUser' },
  { search: 'patientPatientUpdatedByTouser', replace: 'patientUpdatedUser' },
  { search: 'patientChangeHistoryPatientChangeHistoryCreatedByTouser', replace: 'patientChangeHistoryCreatedUser' },
  { search: 'patientChangeHistoryPatientChangeHistoryUpdatedByTouser', replace: 'patientChangeHistoryUpdatedUser' },
  { search: 'patientChangeContentPatientChangeContentCreatedByTouser', replace: 'patientChangeContentCreatedUser' },
  { search: 'patientChangeContentPatientChangeContentUpdatedByTouser', replace: 'patientChangeContentUpdatedUser' },
  { search: 'patientCodeHistoryPatientCodeHistoryCreatedByTouser', replace: 'patientCodeHistoryCreatedUser' },
  { search: 'patientCodeHistoryPatientCodeHistoryUpdatedByTouser', replace: 'patientCodeHistoryUpdatedUser' },
  { search: 'patientFilePatientFileCreatedByTouser', replace: 'patientFileCreatedUser' },
  { search: 'patientFilePatientFileUpdatedByTouser', replace: 'patientFileUpdatedUser' },
  { search: 'inquiryInquiryCreatedByTouser', replace: 'inquiryCreatedUser' },
  { search: 'inquiryInquiryUpdatedByTouser', replace: 'inquiryUpdatedUser' },
  { search: 'inquiryCorrespondInquiryCorrespondCreatedByTouser', replace: 'inquiryCorrespondCreatedUser' },
  { search: 'inquiryCorrespondInquiryCorrespondUpdatedByTouser', replace: 'inquiryCorrespondUpdatedUser' },
  { search: 'inquiryFileInquiryFileCreatedByTouser', replace: 'inquiryFileCreatedUser' },
  { search: 'inquiryFileInquiryFileUpdatedByTouser', replace: 'inquiryFileUpdatedUser' },
]

export default replacements
