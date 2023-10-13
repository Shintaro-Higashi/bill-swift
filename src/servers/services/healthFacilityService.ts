import { HealthFacilityQueryDto } from '@/types'
import {
  fetchHealthFacility as fetch,
  fetchPagedHealthFacilities as fetchPaged,
} from '@/servers/repositories/healthFacilityRepository'
import depend from '@/core/utils/velona'

/**
 * 施設のページング検索を実地します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedHealthFacilities = depend(
  { fetchPaged },
  async ({ fetchPaged }, params: HealthFacilityQueryDto) => {
    return await fetchPaged(params)
  },
)

/**
 * 指定IDの施設情報を取得します。
 * @param id 施設ID
 * @return 施設情報
 */
export const fetchHealthFacility = depend({ fetch }, async ({ fetch }, id: string) => {
  return await fetch(id)
})
