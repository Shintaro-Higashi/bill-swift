import { z } from 'zod'
import { HealthFacilityCodeManageCreationSchema } from '@/types/schema/healthFacilityCodeManage'

// 施設コード管理作成リクエスト
export type HealthFacilityCodeManageCreationRequest = z.infer<typeof HealthFacilityCodeManageCreationSchema>
