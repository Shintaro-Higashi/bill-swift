import { ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { jaJP } from '@mui/x-data-grid'
import { RefineThemes } from '@refinedev/mui'
import { parseCookies, setCookie } from 'nookies'
import React, { createContext, PropsWithChildren, useEffect, useState } from 'react'
import CustomPagination from '@components/core/pagination/customPagination'

/**
 * アプリケーション全体のスタイルテーマを定義するためのContext定義です。
 * <pre>
 *  アプリケーション全体の色味、style,コンポーネントのデフォルトprops値やデフォルトstyleなどを定義します。
 * </pre>
 */

// カラーモード
type ColorModeContextType = {
  mode: string
  setMode: () => void
}

/**
 * テーマ切り替え用Context定義です。
 */
export const ThemeContext = createContext<ColorModeContextType>({} as ColorModeContextType)

// コンポーネントのpropsデフォルト値を変更
const componentTheme = {
  // データグリッド(一覧画面系で利用するテーブル)デフォルト定義
  MuiDataGrid: {
    defaultProps: {
      localeText: jaJP.components.MuiDataGrid.defaultProps.localeText,
      pageSizeOptions: [25, 50, 100],
      // この定義がないと2回検索が実地されるかつ2回目の検索にフィルタ条件が適用されない(原因は不明) ※共通適用困難なので個別定義中
      // filterModel: undefined,
      slots: {
        pagination: CustomPagination,
      },
    },
  },
  // テキスト入力デフォルトスタイルを定義
  MuiTextField: {
    defaultProps: { margin: 'normal', size: 'small', fullWidth: true, InputLabelProps: { shrink: true } },
  },
}

const customTheme = {
  ...RefineThemes.Green,
  components: componentTheme,
}

const customDarkTheme = {
  ...RefineThemes.GreenDark,
  components: componentTheme,
}

/**
 * MUIのテーマを動的に切り替えるためのProvider定義です。
 * @param children
 * @constructor
 */
export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false)
  const [mode, setMode] = useState('light')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const systemTheme = useMediaQuery(`(prefers-color-scheme: dark)`)

  useEffect(() => {
    if (isMounted) {
      setMode(parseCookies()['theme'] || (systemTheme ? 'dark' : 'light'))
    }
  }, [isMounted, systemTheme])

  const toggleTheme = () => {
    const nextTheme = mode === 'light' ? 'dark' : 'light'

    setMode(nextTheme)
    setCookie(null, 'theme', nextTheme)
  }

  return (
    <ThemeContext.Provider
      value={{
        setMode: toggleTheme,
        mode,
      }}
    >
      <ThemeProvider
        // you can change the theme colors here. example: mode === "light" ? RefineThemes.Magenta : RefineThemes.MagentaDark
        theme={mode === 'light' ? customTheme : customDarkTheme}
      >
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
