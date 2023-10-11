'use client'

import { ColorModeContextProvider } from '@/core/contexts/themeContext'
import ROUTE_RESOURCES from '@/core/configs/routeResources'
import { authProvider } from '@/core/providers/authProvider'
import restDataProvider from '@/core/providers/restDataProvider'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { Refine } from '@refinedev/core'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'
import { notificationProvider, RefineSnackbarProvider } from '@refinedev/mui'
import routerProvider from '@refinedev/nextjs-router/app'
import dataProvider from '@refinedev/simple-rest'
import React from 'react'
import i18nProviderInstance from '@/core/providers/i18nProvider'
import { z } from 'zod'
import zodErrorMapJp from '@/core/configs/i18n/zodErrorMapJp'
import { accessControlProvider } from '@/core/providers/accessControlProvider'
// app dir modeでは動作しない
// import { UnsavedChangesNotifier } from '@refinedev/nextjs-router'
/**
 * アプリケーション共通のレイアウト定義です。
 * <pre>
 *  アプリケーション全体定義のみを実地します。UIの変更は各下位のレイアウトで行います。
 * </pre>
 * @param children
 * @constructor
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const i18nProvider = i18nProviderInstance()
  z.setErrorMap(zodErrorMapJp)
  return (
    <>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: 'auto' } }} />
          <html lang='ja'>
            <body>
              <RefineSnackbarProvider>
                <Refine
                  routerProvider={routerProvider}
                  accessControlProvider={accessControlProvider}
                  dataProvider={{
                    fake: dataProvider(process.env.NEXT_PUBLIC_FAKE_API_BASE_URL),
                    default: restDataProvider(process.env.NEXT_PUBLIC_API_BASE_URL),
                  }}
                  notificationProvider={notificationProvider}
                  authProvider={authProvider}
                  i18nProvider={i18nProvider}
                  resources={ROUTE_RESOURCES}
                  options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                    disableTelemetry: true,
                    // 登録,更新系後の遷移先を詳細画面に設定
                    redirect: {
                      afterCreate: 'show',
                      afterClone: 'show',
                      afterEdit: 'show',
                    },
                    reactQuery: {
                      clientConfig: {
                        defaultOptions: {
                          queries: {
                            retry: false,
                          },
                        },
                      },
                    },
                  }}
                >
                  {children}
                  <RefineKbar />
                  {/*<UnsavedChangesNotifier />*/}
                </Refine>
              </RefineSnackbarProvider>
            </body>
          </html>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </>
  )
}
