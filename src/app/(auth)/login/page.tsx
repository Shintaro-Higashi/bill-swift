'use client'

import { ThemedTitleV2 } from '@refinedev/mui'
import { LoginForm } from '@components/domains/login/loginForm'

/**
 * ログインページです。
 * <pre>
 *  AuthPageコンポーネントから利用できるログイン画面ではユーザIDがメールアドレス固定のため
 *  利用せず、LoginPageコンポーネントを複製および部分的に修正して実装しています。
 * </pre>
 */
export default function Login() {
  return (
    <LoginForm
      registerLink={false}
      forgotPasswordLink={false}
      rememberMe={false}
      title={<ThemedTitleV2 collapsed={false} text='bill-swift' />}
    />
  )
}

Login.layout = 'auth'
