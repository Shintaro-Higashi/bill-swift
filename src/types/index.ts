export interface IPost {
  id: string
  title: string
  content?: string
  status: 'published' | 'draft' | 'rejected'
  createdAt: string
  category: ICategory
}

export interface ICategory {
  id: string
  title: string
}

export * from './models/paginationModel'
export * from './models/commonRelateUserModel'

export * from './api/api'

// 会社
export * from './schema/company'
export * from './models/companyModel'
export * from './api/company'
export * from './server/company'
export * from './client/company'

// 施設
export * from './schema/healthFacility'
export * from './models/healthFacilityModel'
export * from './api/healthFacility'
export * from './server/healthFacility'
export * from './client/healthFacility'

// 店舗
export * from './schema/pharmacy'
export * from './models/pharmacyModel'
export * from './api/pharmacy'
export * from './server/pharmacy'
export * from './client/pharmacy'

// 薬局
export * from './schema/pharmacyGroup'
export * from './models/pharmacyGroupModel'
export * from './api/pharmacyGroup'
export * from './server/pharmacyGroup'
export * from './client/pharmacyGroup'

// 施設コードグループ
export * from './schema/healthFacilityCodeGroup'
export * from './models/healthFacilityCodeGroupModel'
export * from './api/healthFacilityCodeGroup'
export * from './server/healthFacilityCodeGroup'
export * from './client/healthFacilityCodeGroup'

// 施設関連薬局
export * from './schema/healthFacilityRelatePharmacy'
export * from './models/healthFacilityRelatePharmacyModel'
export * from './api/healthFacilityRelatePharmacy'
export * from './server/healthFacilityRelatePharmacy'
export * from './client/healthFacilityRelatePharmacy'

// 施設コード管理
export * from './schema/healthFacilityCodeManage'
export * from './models/healthFacilityCodeManageModel'
export * from './api/healthFacilityCodeManage'
export * from './server/healthFacilityCodeManage'
export * from './client/healthFacilityCodeManage'

// 患者
export * from './schema/patient'
export * from './models/patientModel'
export * from './api/patient'
export * from './server/patient'
export * from './client/patient'

// ユーザ
export * from './schema/user'
export * from './models/userModel'
export * from './api/user'
export * from './server/user'
export * from './client/user'

// 認証
export * from './schema/auth'
export * from './api/auth'
export * from './server/auth'

// 口座管理
export * from './schema/accountManage'
export * from './models/accountManageModel'
export * from './api/accountManage'
export * from './server/accountManage'
export * from './client/accountManage'
