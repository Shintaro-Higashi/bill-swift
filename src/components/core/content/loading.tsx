import { Box, CircularProgress } from '@mui/material'
import React from 'react'

/**
 * ローディン中の状態を表示するコンポーネント定義です。
 */
export const Loading = () => {
  return (
    <Box sx={{ display: 'flex', p: 1, justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  )
}
