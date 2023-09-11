'use client'

import { AuthPage, ThemedTitleV2 } from '@refinedev/mui'

export default function Login() {
  return (
    <AuthPage
      type='login'
      registerLink={false}
      formProps={{
        defaultValues: { email: 'demo555@upstream-j.co.jp', password: 'GoGoGo555444332211' },
      }}
      title={<ThemedTitleV2 collapsed={false} text='bill-swift' />}
    />
  )
}

Login.layout = 'auth'
