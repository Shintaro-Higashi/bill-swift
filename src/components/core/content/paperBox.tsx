'use client'

import { Box, Paper, PaperProps } from '@mui/material'
import React from 'react'
import Typography from '@mui/material/Typography'

// 各ボックスのヘッダープロパティ
type PaperHeaderProps = {
  // ヘッダアイコン
  icon: React.ReactNode
  // ヘッダタイトル
  title: string
}

export type PaperBoxProps = {} & PaperHeaderProps & PaperProps

/**
 * 各ボックスのヘッダーです
 * @param props プロパティ
 */
const PaperHeader = (props: PaperHeaderProps) => {
  const { icon, title } = props
  return (
    <>
      <Typography
        variant='h5'
        color='white'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'primary.main',
          borderRadius: 1,
          mb: 1,
          mt: 0,
        }}
      >
        <Box component='span'>
          <Box component='span' sx={{ position: 'relative', top: '4px' }}>
            {icon}
          </Box>
          <Box sx={{ ml: 1 }} component='span'>
            {title}
          </Box>
        </Box>
      </Typography>
    </>
  )
}

/**
 * 見出しヘッダ付きのMUI PaperComponentWrapperです
 * @param props
 */
export const PaperBox = (props: PaperBoxProps) => {
  const { icon, title, children, sx, ...paperProps } = props
  return (
    <Paper sx={sx} onMouseEnter={paperProps.onMouseEnter} onMouseLeave={paperProps.onMouseLeave}>
      <PaperHeader icon={icon} title={title} />
      {children}
    </Paper>
  )
}
