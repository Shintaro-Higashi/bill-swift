import { AuthBindings } from '@refinedev/core'
import nookies from 'nookies'

/**
 * 認証状態を制御するためのProvider定義情報です。
 */

// モックユーザ
const mockUsers = [
  {
    email: 'demo555@upstream-j.co.jp',
    roles: ['admin'],
  },
  {
    email: 'editor@refine.dev',
    roles: ['editor'],
  },
  {
    email: 'demo@refine.dev',
    roles: ['user'],
  },
]

/**
 * 認証状態を制御するためのProvider定義です。
 */
export const authProvider: AuthBindings = {
  /**
   * 認証処理です。
   * @param email
   */
  login: async ({ email }) => {
    // Suppose we actually send a request to the back end here.
    const user = mockUsers.find((item) => item.email === email)

    if (user) {
      nookies.set(null, 'auth', JSON.stringify(user), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
      return {
        success: true,
        redirectTo: '/',
      }
    }

    return {
      success: false,
      error: {
        message: 'Login failed',
        name: 'Invalid email or password',
      },
    }
  },
  register: async (params) => {
    // Suppose we actually send a request to the back end here.
    const user = mockUsers.find((item) => item.email === params.email)

    if (user) {
      nookies.set(null, 'auth', JSON.stringify(user), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
      return {
        success: true,
        redirectTo: '/',
      }
    }
    return {
      success: false,
      error: {
        message: 'Register failed',
        name: 'Invalid email or password',
      },
    }
  },
  /**
   * パスワード再設定処理です。
   * @param params
   */
  forgotPassword: async (params) => {
    // Suppose we actually send a request to the back end here.
    const user = mockUsers.find((item) => item.email === params.email)

    if (user) {
      return {
        success: true,
        redirectTo: '/login',
      }
    }
    return {
      success: false,
      error: {
        message: 'パスワードの再設定ができませんでした',
        name: '未登録のメールアドレスです',
      },
    }
  },
  /**
   * パスワード更新処理です。
   * @param params
   */
  updatePassword: async (params) => {
    // Suppose we actually send a request to the back end here.
    const isPasswordInvalid = params.password === '123456' || !params.password

    if (isPasswordInvalid) {
      return {
        success: false,
        error: {
          message: 'Update password failed',
          name: 'Invalid password',
        },
      }
    }

    return {
      success: true,
    }
  },
  /**
   * ログアウト時の処理です。
   */
  logout: async () => {
    nookies.destroy(null, 'auth')
    return {
      success: true,
      redirectTo: '/login',
    }
  },
  /**
   * 認証エラー時の処理です。
   * @param error
   */
  onError: async (error) => {
    if (error && error.statusCode === 401) {
      return {
        error: new Error('Unauthorized'),
        logout: true,
        redirectTo: '/login',
      }
    }

    return {}
  },
  /**
   * 正常な認証済の状態か判定します。
   * <pre>
   *  ・初回のURLからのアクセスの時のみ呼ばれます
   *  ・画面遷移の都度はcallされません
   * </pre>
   * @param authCookie
   */
  check: async (authCookie) => {
    if (authCookie) {
      return {
        authenticated: true,
      }
    } else {
      const cookies = nookies.get(null)

      if (cookies.auth) {
        return {
          authenticated: true,
        }
      }
    }

    return {
      authenticated: false,
      error: {
        message: 'Check failed',
        name: 'Unauthorized',
      },
      logout: true,
      redirectTo: '/login',
    }
  },
  /**
   * ログイン中ユーザの権限情報を取得します。
   */
  getPermissions: async () => {
    const auth = nookies.get()['auth']
    if (auth) {
      const parsedUser = JSON.parse(auth)
      return parsedUser.roles
    }
    return null
  },
  /**
   * ログイン中のユーザ情報を取得します。
   */
  getIdentity: async () => {
    const cookies = nookies.get(null)
    if (!cookies.auth) return null
    return {
      id: 1,
      name: '薬剤 歴史',
      avatar: 'https://unsplash.com/photos/IWLOvomUmWU/download?force=true&w=640',
    }
  },
}
