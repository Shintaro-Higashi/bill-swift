'use client'

import { authProvider } from '@/core/providers/authProvider'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'

/**
 * ログイン認証前の画面用レイアウトです。
 * @param children
 */
export default function UnProtectedLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  useEffect(() => {
    const fetchAuth = async () => {
      const auth = await authProvider.check()
      setAuthenticated(auth.authenticated)
    }
    fetchAuth().then()
  }, [])

  useEffect(() => {
    if (authenticated) {
      redirect('/')
    }
  }, [authenticated])

  if (authenticated) {
    return null
  } else {
    return <>{children}</>
  }
}
