'use client'

import { Box } from '@mui/material'
import React, { useContext } from 'react'
import Typography from '@mui/material/Typography'
import { ThemeContext } from '@/core/contexts/themeContext'
import { InfoOutlined } from '@mui/icons-material'

type Props = {
  // 項目名
  label: string
  // 項目名に表示するアイコン
  icon?: React.ReactNode
  // 項目値
  value: React.ReactNode | string | null | undefined
  // 項目ヘルプ情報
  helperText?: string | null | undefined
  // 項目値がない時に表示する内容
  defaultValue?: React.ReactNode | string | null | undefined
}
/**
 * 詳細画面などで利用する項目名と項目値を出力します。
 */
export const FieldItem = (props: Props) => {
  const { mode } = useContext(ThemeContext)
  return (
    <Box>
      <Typography
        variant='label'
        borderColor='primary.main'
        color={mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)'}
      >
        <Box
          component={'span'}
          sx={{
            '& .MuiSvgIcon-root ': { fontSize: '1.0rem', verticalAlign: 'text-bottom' },
          }}
        >
          {props.icon}
        </Box>
        {props.label}
      </Typography>
      <Typography variant='body1' sx={{ whiteSpace: 'pre-wrap' }}>
        {props?.value ?? props?.defaultValue ?? ' '}
      </Typography>
      {props?.helperText ? (
        <Typography
          variant='caption'
          color={mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)'}
          marginLeft='4px'
        >
          <InfoOutlined sx={{ fontSize: '1.0rem', verticalAlign: 'text-bottom' }} />
          {props?.helperText}
        </Typography>
      ) : null}
    </Box>
  )
}
