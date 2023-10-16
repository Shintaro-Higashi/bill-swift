import GlobalStyles from '@mui/material/GlobalStyles'

/**
 * globalなCSSスタイル定義です。
 * <pre>
 *   利用する時は <AppGlobalStyles /> ではなく {AppGlobalStyles} で定義が必要です。
 *   再レンダリング不要なためリアクティブ対象外にしてパフォーマンスを向上させます。
 * </pre>
 */
const AppGlobalStyles = (
  <GlobalStyles
    styles={{
      html: { WebkitFontSmoothing: 'auto' },
    }}
  />
)

export default AppGlobalStyles
