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
