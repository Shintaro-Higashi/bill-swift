import { Prisma } from '.prisma/client'
import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import depend from '@/core/utils/velona'
import { getCurrentDate } from '@/core/utils/dateUtil'
import { createId } from '@paralleldrive/cuid2'
import { PaginationModel, UserCreationDto, UserEditingDto, UserModel, UserQueryDto } from '@/types'
import { UserUserType } from '@prisma/client'
import SortOrder = Prisma.SortOrder
import { getAuthorizedUserId } from '@/core/utils/requestUtil'

/**
 * ユーザのページング検索を実施します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedUsers = async (params: UserQueryDto): Promise<PaginationModel<UserModel>> => {
  const orderBy: Prisma.UserOrderByWithRelationInput[] = [{ id: SortOrder.asc }]
  if (params.sort && params.order) {
    orderBy.unshift({ [params.sort]: params.order })
  }

  const entities = await prisma.user.paginate({
    where: { name: { contains: params.name }, existence: true },
    include: { createdUser: true, updatedUser: true },
    orderBy: orderBy,
    pageNo: params.pageNo,
    pageSize: params.pageSize,
  })
  return entities as unknown as PaginationModel<UserModel>
}

/**
 * 指定IDのユーザ情報を取得します。
 * @param id ID
 * @return ユーザ情報
 */
export const fetchUser = async (id: string) => {
  return await prisma.user.findUniqueOrThrow({
    where: { id: id, existence: true },
    include: { createdUser: true, updatedUser: true },
  })
}

/**
 * 指定のログイン用ユーザIDに該当するユーザを取得します。
 * <pre>
 *  該当ユーザがいない場合でもErrorをthrowせず、nullを返します。
 * </pre>
 * @param userId ユーザID
 * @return ユーザ情報
 */
export const fetchUserByUserId = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { userId_existence: { userId, existence: true } },
  })
}

/**
 * ユーザを作成します。
 * @param params
 */
export const createUser = depend({ client: prisma }, async ({ client }, params: UserCreationDto) => {
  const now = getCurrentDate()
  const userId = getAuthorizedUserId()
  return await client.user.create({
    data: {
      id: createId(),
      ...params,
      userType: params.userType?.toString() as UserUserType,
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
    },
  })
})

/**
 * 指定のユーザ情報を更新します。
 * @param id ユーザID
 * @param params ユーザ情報
 */
export const updateUser = depend({ client: prisma }, async ({ client }, id: string, params: UserEditingDto) => {
  const now = getCurrentDate()
  return await client.user.update({
    data: {
      ...params,
      userType: params.userType?.toString() as UserUserType,
      updatedBy: getAuthorizedUserId(),
      updatedAt: now,
    },
    where: { id: id, existence: true },
  })
})

/**
 * 指定のユーザ情報を論理削除します。
 * @param id ID
 */
export const archiveUser = depend({ client: prisma }, async ({ client }, id: string) => {
  const now = getCurrentDate()
  return await client.user.update({
    data: {
      updatedBy: getAuthorizedUserId(),
      deletedAt: now,
    },
    where: { id: id, deletedAt: null },
  })
})
