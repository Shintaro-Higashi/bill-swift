'use client'

import { AppIcon } from '@components/core/appIcon'
import { Header } from '@components/core/header/header'
import { Authenticated } from '@refinedev/core'
import { ThemedLayoutV2, ThemedTitleV2 } from '@refinedev/mui'
import React, { useEffect } from 'react'
import ConfirmProvider from '@components/core/confirm/confirmProvider'
import { usePathname } from 'next/navigation'

/**
 * ログイン認証後の画面用レイアウトです。
 * @param children
 * @constructor
 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // TODO 画面遷移時のフック処理実装予定(認証チェックなど)
  useEffect(() => {
    // 画面遷移のたびに実行される処理をここに記述
    // console.log('画面遷移が行われました ' + pathname)

    return () => {
      // クリーンアップ処理
      // ...
    }
  }, [pathname]) // ページパスが変更された時に実行

  return (
    <Authenticated redirectOnFail='/login' v3LegacyAuthProviderCompatible={false}>
      <ThemedLayoutV2
        Header={() => <Header sticky />}
        Title={({ collapsed }) => <ThemedTitleV2 collapsed={collapsed} text='BillSwift' icon={<AppIcon />} />}
      >
        <ConfirmProvider>{children}</ConfirmProvider>
      </ThemedLayoutV2>
    </Authenticated>
  )
}
