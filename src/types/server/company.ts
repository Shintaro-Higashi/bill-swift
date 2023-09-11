import { CompanyCreationRequest, CompanyQueryRequest } from '@/types'

// 会社検索Dto
export type CompanyQueryDto = CompanyQueryRequest & {}
// 会社作成Dto
export type CompanyCreationDto = CompanyCreationRequest & {}
// 会社編集Dto
export type CompanyEditingDto = CompanyCreationRequest & {}
