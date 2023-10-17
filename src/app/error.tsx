'use client'

import { useEffect } from 'react'
import { ThemedLayoutV2 } from '@refinedev/mui'
import Button from '@mui/material/Button'

/**
 * フロント側のグローバルエラーページです。
 */
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('global-error-page', error)
  }, [error])

  return (
    <ThemedLayoutV2>
      <h2>予期せぬエラーが発生しました</h2>
      <p>問題が解決しない場合はサポートまでご連絡ください</p>
      <Button onClick={() => reset()}>もう一度処理を続行する</Button>
    </ThemedLayoutV2>
  )
}
