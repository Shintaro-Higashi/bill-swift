import { LoginDto } from '@/types'
import { fetchUser as fetch, fetchUserByUserId } from '@/servers/services/userService'
import depend from '@/core/utils/velona'
import bcrypt from 'bcryptjs'
import { LoginModel } from '@/types/models/authModel'
import UnauthorizedError from '@/servers/core/errors/unauthorizedError'
import { createJWTToken } from '@/servers/services/tokenService'

/**
 * ログイン認証を実施します。
 * @params ログイン情報
 * @return ログインユーザ情報
 * @throws UnauthorizedError 認証
 */
export const login = depend({ fetchUserByUserId }, async ({ fetchUserByUserId }, params: LoginDto) => {
  const user = await fetchUserByUserId(params.userId ?? '')

  if (!user) throw new UnauthorizedError()
  const isPasswordMatched = await bcrypt.compare(params.password ?? '', user.password ?? '')
  if (!isPasswordMatched) {
    throw new UnauthorizedError()
  }

  const loginUser: LoginModel = {
    id: user.id,
    name: user.name,
    token: await createJWTToken(user.id),
    userType: user.userType,
  }
  return loginUser
})

export const createLoginUser = depend({ fetch }, async ({ fetch }, id: string) => {
  const user = await fetch(id)
  return {
    id: user.id,
    name: user.name,
    token: await createJWTToken(user.id),
    userType: user.userType,
  } as LoginModel
})
