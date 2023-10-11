import { AuthBindings } from '@refinedev/core'
import nookies from 'nookies'
import { axiosInstance } from '@/core/providers/restDataProvider'
import { HTTP_STATUS } from '@/core/configs/constants'
import axios from 'axios'
import { LoginModel } from '@/types/models/authModel'

// getIdentityをcache
let userIdentity: LoginModel | null = null

/**
 * 認証状態を制御するためのProvider定義です。
 */
export const authProvider: AuthBindings = {
  /**
   * 認証処理です。
   * @param userId ユーザID
   * @param password パスワード
   */
  login: async ({ userId, password }) => {
    try {
      const { data }: { data: LoginModel } = await axiosInstance.post('/api/auth/login', { userId, password })
      userIdentity = data
      nookies.set(null, 'token', data.token, {
        maxAge: process.env.JWT_TOKEN_EXPIRATION_SECONDS,
        path: '/',
      })
      // ヘッダ認証に切り替える場合に必要
      // axiosInstance.defaults.headers.common = {
      //   Authorization: `Bearer ${data.token}`,
      // };
      return {
        success: true,
        redirectTo: '/',
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === HTTP_STATUS.UNAUTHORIZED) {
        return {
          success: false,
          error: {
            message: 'ログインできませんでした',
            name: 'ユーザIDまたはパスワードを確認してください',
          },
        }
      }
      throw e
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
    userIdentity = null
    nookies.destroy(null, 'token')
    return {
      success: true,
      redirectTo: '/login',
    }
  },
  register: async (params) => {
    // // Suppose we actually send a request to the back end here.
    // const user = mockUsers.find((item) => item.email === params.email)
    //
    // if (user) {
    //   nookies.set(null, 'auth', JSON.stringify(user), {
    //     maxAge: 30 * 24 * 60 * 60,
    //     path: '/',
    //   })
    //   return {
    //     success: true,
    //     redirectTo: '/',
    //   }
    // }
    return {
      success: false,
      error: {
        message: 'Register failed',
        name: 'Invalid email or password',
      },
    }
  },
  forgotPassword: async (params) => {
    return {
      success: false,
      error: {
        message: 'Register failed',
        name: 'Invalid email or password',
      },
    }
  },
  /**
   * エラー発生時の処理です。
   * <pre>
   *  認証以外のエラーもcallされます。
   * </pre>
   * @param error
   */
  onError: async (error) => {
    console.log('エラー発生', error)
    if (error && error.statusCode === 401) {
      return {
        error: new Error('認証が必要です'),
        logout: true,
        redirectTo: '/login',
      }
    }

    return {}
  },
  /**
   * 認証済の状態か判定します。
   */
  check: async () => {
    const cookies = nookies.get(null)
    if (cookies.token) {
      const { data: tokenData }: { data: { token: string } } = await axiosInstance.get('/api/auth/token')
      const { data: loginData }: { data: LoginModel } = await axiosInstance.get('/api/auth')
      userIdentity = loginData
      nookies.set(null, 'token', tokenData.token, {
        maxAge: process.env.JWT_TOKEN_EXPIRATION_SECONDS,
        path: '/',
      })

      return {
        authenticated: true,
      }
    }
    return {
      authenticated: false,
      error: {
        message: '認証が必要です',
        name: 'ログインしてください',
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
    // ここでAPIを実地すると画面リロード時など大量に実行されるため(accessControlProviderから利用しているため)キャッシュのみを参照する
    // APIからの取得はログイン後と最初のtokenチェック時に行う
    return userIdentity
  },
}
