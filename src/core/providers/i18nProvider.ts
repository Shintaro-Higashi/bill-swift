import { I18nProvider } from '@refinedev/core'
import * as TRANSLATE_JA from '@/core/configs/i18n/ja.json'
import { getPropertyByFlatKey } from '@/core/utils/commonUtil'

let i18nProvider: I18nProvider

/**
 * 翻訳Providerを取得します。
 * @return 翻訳Provider
 */
const i18nProviderInstance = () => {
  if (i18nProvider) {
    return i18nProvider
  }
  i18nProvider = {
    // Next.js v13 app dir & refine でのi18n実装方法のPracticeが見つからなかったため下記コードで対応中
    // ※多言語対応は不要なため現在問題化していないが良いコードがわかれば修正をするべき
    translate: (key: string, params: object) => {
      const translatedContent = getPropertyByFlatKey(TRANSLATE_JA, key)
      if (translatedContent && params) {
        return _setParams(translatedContent, params)
      }
      return translatedContent || params?.toString() || key
    },
    changeLocale: (lang: string) => Promise.resolve(lang),
    getLocale: () => 'ja',
  }
  return i18nProvider
}

/**
 * 翻訳文字列の{{key}} 情報を置換します。
 * @param translatedContent
 * @param params
 */
function _setParams(translatedContent: string, params: any) {
  return translatedContent.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key] || match
  })
}

export default i18nProviderInstance
