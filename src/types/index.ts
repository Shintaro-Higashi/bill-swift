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
