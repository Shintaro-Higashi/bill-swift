'use client'

import { authProvider } from '@/core/providers/authProvider'
import { redirect } from 'next/navigation'
import React from 'react'

async function checkAuth(authCookie?: string) {
  return await authProvider.check(authCookie)
}

/**
 * ログイン認証前の画面用レイアウトです。
 * @param children
 */
// @ts-ignore
export default async function UnProtectedLayout({ children }: { children: React.ReactNode }) {
  const { authenticated } = await checkAuth()
  if (authenticated) {
    redirect('/')
  } else {
    return children
  }
}
