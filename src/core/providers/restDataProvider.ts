import { DataProvider, HttpError } from '@refinedev/core'
import dataProvider, { generateFilter, generateSort } from '@refinedev/simple-rest'
import axios, { AxiosInstance } from 'axios'
import { stringify } from 'query-string'
import { toDateForStringDate } from '@/core/utils/commonUtil'

type MethodTypes = 'get' | 'delete' | 'head' | 'options'

// デフォルトで利用するHTTPClient (現在これ以外の利用予定はない)
export const axiosInstance = axios.create()
axiosInstance.interceptors.response.use(
  (response) => {
    // 日付と推測可能なフィールドをModelTypeと合わせるためDate型かつJSTに変換
    const fixDateResponseData = toDateForStringDate(response?.data)
    if (response?.data) response.data = fixDateResponseData
    return response
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    }

    return Promise.reject(customError)
  },
)

/**
 * デフォルトの挙動を一部カスタマイズしたDataProviderです。
 * <pre>
 *  getListのみをカスタマイズしています。
 *  ・APIサーバ側のpagination仕様に準拠させるためAPI実行時のリクエストパラメータ及びレスポンスを調整しています。
 *    ・_start,_endではなくpageNo(開始ページ数),pageSize(1ページあたりの表示数) をパラメータで指定するように
 *    ・APIレスポンス結果は{items:検索結果、count:合致件数,pageCount:取得件数} の形式のためそこから取得して結果を返すように
 * </pre>
 * @param apiUrl
 * @param httpClient
 */
const restDataProvider = (apiUrl: string, httpClient: AxiosInstance = axiosInstance): DataProvider => {
  const simpleRestDataProvider = dataProvider(apiUrl, axiosInstance)
  return {
    ...simpleRestDataProvider,
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
      const url = `${apiUrl}/${resource}`

      const { current = 1, pageSize = 25, mode = 'server' } = pagination ?? {}
      const { headers: headersFromMeta, method } = meta ?? {}
      const requestMethod = (method as MethodTypes) ?? 'get'
      const queryFilters = generateFilter(filters)

      const query: {
        pageNo?: number
        pageSize?: number
        sort?: string
        order?: string
      } = {}

      if (mode === 'server') {
        query.pageNo = current
        query.pageSize = pageSize
      }

      const generatedSort = generateSort(sorters)
      if (generatedSort) {
        const { _sort, _order } = generatedSort
        // UI上MUI Freeは１件のみソート可能なため先頭のみ採用
        query.sort = _sort[0]
        query.order = _order[0]
      }

      const { data } = await httpClient[requestMethod](`${url}?${stringify(query)}&${stringify(queryFilters)}`, {
        headers: headersFromMeta,
      })
      return {
        data: data.items,
        total: data.count,
      }
    },
    getMany: undefined,
  }
}

export default restDataProvider
