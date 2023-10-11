import { SignJWT, jwtVerify } from 'jose'
import { UserTypeKey } from '@/shared/items/userType'

/**
 * JWTトークンのPayload
 */
export type TokenPayload = {
  id: string
  userType: UserTypeKey
}

// JWTトークン生成に利用するアルゴリズム
const TOKEN_ALGORITHM = 'HS256'

/**
 * 認証用JTWTokenを作成します。
 * @param id payloadに含めるユーザのID
 */
export const createJWTToken = (id: string, userType: UserTypeKey) => {
  const payload: TokenPayload = {
    id,
    userType,
  }

  return new SignJWT(payload)
    .setProtectedHeader({ alg: TOKEN_ALGORITHM, typ: 'JWT' })
    .setExpirationTime(`${process.env.JWT_TOKEN_EXPIRATION_SECONDS}s`)
    .setIssuedAt()
    .sign(new TextEncoder().encode(process.env.JWT_TOKEN_SECRET))
}

/**
 * JWTTokenの検証を行います。
 * @param token JWTToken
 * @return payloadに含まれるユーザのID
 */
export const verifyJWTToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_TOKEN_SECRET))
    return payload as TokenPayload
  } catch (e) {
    return null
  }
}
