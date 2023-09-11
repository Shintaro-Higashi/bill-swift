import { CompanyCreationRequest, CompanyEditingRequest, CompanyQueryRequest } from '@/types'

// 会社検索フォーム
export type CompanyQueryForm = CompanyQueryRequest & {}
// 会社作成フォーム
export type CompanyCreationForm = CompanyCreationRequest & {}
// 会社編集フォーム
export type CompanyEditingForm = CompanyEditingRequest & {}
