import { ResourceProps } from '@refinedev/core'

/**
 * ブログ投稿管理リソース情報です
 */
const name = 'posts'
/**
 * ブログ投稿内容リソース情報です
 */
const ROUTE: ResourceProps = {
  name,
  list: `/${name}`,
  create: `/${name}/create`,
  edit: `/${name}/edit/:id`,
  show: `/${name}/show/:id`,
  meta: {
    dataProviderName: 'fake',
    order: 99,
    canDelete: true,
    hide: true,
  },
}

export default ROUTE
