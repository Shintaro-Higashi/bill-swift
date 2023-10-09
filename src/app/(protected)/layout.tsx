'use client'

import { AppIcon } from '@components/core/appIcon'
import { Header } from '@components/core/header/header'
import { Authenticated } from '@refinedev/core'
import { ThemedLayoutV2, ThemedTitleV2 } from '@refinedev/mui'
import React from 'react'
import ConfirmProvider from '@components/core/confirm/confirmProvider'

/**
 * ログイン認証後の画面用レイアウトです。
 * @param children
 * @constructor
 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
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
