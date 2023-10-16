import { ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { RefineThemes } from '@refinedev/mui'
import { parseCookies, setCookie } from 'nookies'
import React, { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { Theme } from '@mui/system'
import theme from '@styles/theme'
import { createTheme } from '@mui/material/styles'
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

const customTheme = createTheme({
  ...RefineThemes.Green,
  ...theme,
})

const customDarkTheme: Partial<Theme> = createTheme({
  ...RefineThemes.GreenDark,
  ...theme,
})

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
