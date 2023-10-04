import { PharmacyGroupQueryDto } from '@/types'
import {
  fetchPharmacyGroup as fetch,
  fetchPagedPharmacyGroups as fetchPaged,
} from '@/servers/repositories/pharmacyGroupRepository'
import depend from '@/core/utils/velona'

/**
 * 薬局のページング検索を実地します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedPharmacyGroups = depend(
  { fetchPaged },
  async ({ fetchPaged }, params: PharmacyGroupQueryDto) => {
    return await fetchPaged(params)
  },
)

/**
 * 指定IDの薬局情報を取得します。
 * @param id 薬局ID
 * @return 薬局情報
 */
export const fetchPharmacyGroup = depend({ fetch }, async ({ fetch }, id: string) => {
  return await fetch(id)
})
