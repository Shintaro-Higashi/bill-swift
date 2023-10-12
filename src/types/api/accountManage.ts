import { z } from 'zod'
import {
  AccountManageCreationSchema,
  AccountManageEditingSchema,
  AccountManageQuerySchema,
} from '@/types/schema/accountManage'

// 口座管理検索リクエスト
export type AccountManageQueryRequest = z.infer<typeof AccountManageQuerySchema>
// 口座管理作成リクエスト
export type AccountManageCreationRequest = z.infer<typeof AccountManageCreationSchema>
// 口座管理編集リクエスト
export type AccountManageEditingRequest = z.infer<typeof AccountManageEditingSchema>
