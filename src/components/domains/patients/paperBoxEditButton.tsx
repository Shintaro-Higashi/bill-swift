'use client'

import { Box } from '@mui/material'
import React from 'react'
import { EditOutlined } from '@mui/icons-material'
import Button from '@mui/material/Button'

type Props = {
  showButton: boolean
  handleClick: () => void
}

/**
 * 患者詳細画面の各PaperToggleBox内に配置するための編集Box切り替えボタンです
 */
export const PaperBoxEditButton = (props: Props) => {
  const { showButton, handleClick } = props
  return (
    <Box
      flexDirection='row'
      justifyContent='flex-end'
      display='flex'
      sx={{ position: 'relative', display: showButton ? 'flex' : 'none' }}
    >
      <Button
        variant='contained'
        startIcon={<EditOutlined />}
        size='small'
        sx={{ position: 'absolute', bottom: '0px', zIndex: 100 }}
        onClick={handleClick}
      >
        編集
      </Button>
    </Box>
  )
}
