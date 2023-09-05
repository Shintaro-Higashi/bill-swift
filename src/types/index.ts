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
