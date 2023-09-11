'use client'

import { ThemeContext } from '@/core/contexts/themeContext'
import Identity from '@components/core/header/identity'
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlined from '@mui/icons-material/LightModeOutlined'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import { HamburgerMenu, RefineThemedLayoutV2HeaderProps } from '@refinedev/mui'
import React, { useContext } from 'react'

/**
 * 認証後のメインレイアウトで利用するヘッダコンポーネントを定義します。
 * @param sticky ヘッダをスクロール中も固定にするか
 * @constructor
 */
export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({ sticky = true }) => {
  const { mode, setMode } = useContext(ThemeContext)

  return (
    <AppBar position={sticky ? 'sticky' : 'relative'}>
      <Toolbar>
        <Stack direction='row' width='100%' alignItems='center'>
          <HamburgerMenu />
          <Stack direction='row' width='100%' justifyContent='flex-end' alignItems='center' gap='16px'>
            <IconButton
              color='inherit'
              onClick={() => {
                setMode()
              }}
            >
              {mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
            <Identity />
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
