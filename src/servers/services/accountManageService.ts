import { AccountManageQueryDto } from '@/types'
import { fetchPagedAccountManages as fetchPaged } from '@/servers/repositories/accountManageRepository'
import depend from '@/core/utils/velona'

/**
 * 口座管理のページング検索を実地します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedCompanies = depend({ fetchPaged }, async ({ fetchPaged }, params: AccountManageQueryDto) => {
  return await fetchPaged(params)
})
