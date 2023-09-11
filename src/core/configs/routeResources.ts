import { ResourceProps } from '@refinedev/core'

/**
 * アプリケーション全体のルーティング定義です。
 * <pre>
 *  <Refine>コンポーネントのresources属性に指定して利用します。
 *  ./routes/*.tsx を集約して１つのresources情報を生成するため
 *  ルーティング定義を各機能/ファイル 単位で管理することが可能です。
 * </pre>
 */
const ROUTE_RESOURCES: ResourceProps[] = []

//libs/routes/* のdefault 変数配列を全て追加
const requireModule = require.context('./routes', false, /\.tsx$/)
// meta.order でmenuを表示
const routeList = requireModule.keys().sort((a, b) => {
  const metaA = requireModule(a).default.meta
  const metaB = requireModule(b).default.meta
  return metaA?.order - metaB?.order
})
routeList.forEach((fileName) => {
  if (fileName === './index.ts') return
  const meta = requireModule(fileName).default.meta
  if (meta?.disabled) return
  ROUTE_RESOURCES.push(requireModule(fileName).default)
})
export default ROUTE_RESOURCES
