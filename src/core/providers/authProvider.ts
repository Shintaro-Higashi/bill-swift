import { AuthBindings } from '@refinedev/core'
import nookies from 'nookies'
import { axiosInstance } from '@/core/providers/restDataProvider'
import { HTTP_STATUS } from '@/core/configs/constants'
import axios from 'axios'
import { LoginModel } from '@/types/models/authModel'
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
      nookies.set(null, 'token', data.token, {
        maxAge: process.env.JWT_TOKEN_EXPIRATION_SECONDS,
        path: '/',
      })
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
   * 認証エラー時の処理です。
   * @param error
   */
  onError: async (error) => {
    console.log('認証エラー発生', error)
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
      const { data }: { data: LoginModel } = await axiosInstance.get('/api/auth')
      nookies.set(null, 'token', data.token, {
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
    const cookies = nookies.get(null)
    if (!cookies.auth) return null
    return {
      id: 1,
      name: '薬剤 歴史',
      avatar: 'https://unsplash.com/photos/IWLOvomUmWU/download?force=true&w=640',
    }
  },
}
