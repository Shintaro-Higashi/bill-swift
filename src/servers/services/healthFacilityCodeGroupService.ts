import { HealthFacilityCodeGroupQueryDto } from '@/types'
import {
  fetchHealthFacilityCodeGroup as fetch,
  fetchPagedHealthFacilityCodeGroups as fetchPaged,
} from '@/servers/repositories/healthFacilityCodeGroupRepository'
import depend from '@/core/utils/velona'

/**
 * 施設コードグループのページング検索を実地します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedHealthFacilityCodeGroups = depend(
  { fetchPaged },
  async ({ fetchPaged }, params: HealthFacilityCodeGroupQueryDto) => {
    return await fetchPaged(params)
  },
)

/**
 * 指定IDの施設コードグループ情報を取得します。
 * @param id 施設コードグループID
 * @return 施設コードグループ情報
 */
export const fetchHealthFacilityCodeGroup = depend({ fetch }, async ({ fetch }, id: string) => {
  return await fetch(id)
})
