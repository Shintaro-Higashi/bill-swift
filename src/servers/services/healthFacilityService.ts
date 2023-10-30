import { HealthFacilityCreationDto, HealthFacilityEditingDto, HealthFacilityQueryDto } from '@/types'
import {
  archiveHealthFacility as archive,
  createHealthFacility as rCreateHealthFacility,
  updateHealthFacility as update,
  fetchHealthFacility as fetch,
  fetchPagedHealthFacilities as fetchPaged,
  getRelatedEntitiesData,
} from '@/servers/repositories/healthFacilityRepository'
import { createHealthFacilityRelatePharmacy as rCreateHealthFacilityRelatePharmacy } from '@/servers/repositories/healthFacilityRelatePharmacyRepository'
import {
  getMaxCode,
  createHealthFacilityCodeManage as rCreateHealthFacilityCodeManage,
} from '@/servers/repositories/healthFacilityCodeManageRepository'

import depend from '@/core/utils/velona'
import { performTransaction } from '../repositories/performTransaction'
import { getHealthFacilityNonAssignableCodes } from '../shared/configs/healthFacilityNonAssignableCodes'
import { HealthFacilityCodeGroupFormatType } from '.prisma/client'

/**
 * 施設のページング検索を実地します。
 * @param params 検索条件
 * @return 検索結果
 */
export const fetchPagedHealthFacilities = depend(
  { fetchPaged },
  async ({ fetchPaged }, params: HealthFacilityQueryDto) => {
    return await fetchPaged(params)
  },
)

/**
 * 指定IDの施設情報を取得します。
 * @param id 施設ID
 * @return 施設情報
 */
export const fetchHealthFacility = depend({ fetch }, async ({ fetch }, id: string) => {
  return await fetch(id)
})

/**
 * 施設を作成します。
 * @param params
 */
export const createHealthFacility = depend(
  { rCreateHealthFacility, rCreateHealthFacilityRelatePharmacy, rCreateHealthFacilityCodeManage },
  async (
    { rCreateHealthFacility, rCreateHealthFacilityRelatePharmacy, rCreateHealthFacilityCodeManage },
    params: HealthFacilityCreationDto,
  ) => {
    // 施設コードグループのフォーマットタイプを取得
    const relatedEntitiesData = await getRelatedEntitiesData(params.pharmacyId)
    if (!relatedEntitiesData) {
      throw new Error('コード採番：関連エンティティの取得に失敗しました')
    }
    const formatType = relatedEntitiesData.company?.healthFacilityCodeGroup?.formatType
    const codeGroupId = relatedEntitiesData.company?.healthFacilityCodeGroup?.id

    // 施設作成に必要な情報を取得
    const code = await createHealthFacilityCode(codeGroupId, formatType)
    const searchName = params.name.replace(/[\s\u3000]+/g, '') + params.nameKana.replace(/[\s\u3000]+/g, '')

    return await performTransaction(async (tx: any) => {
      // 施設作成
      const tCreateHealthFacility: typeof rCreateHealthFacility = (rCreateHealthFacility as any).inject({ client: tx })
      const healthFacilityParams = { ...params, code, searchName }
      const resultCreateHealthFacility = await tCreateHealthFacility(healthFacilityParams)

      // 施設関連薬局作成
      const tCreateHealthFacilityRelatePharmacy: typeof rCreateHealthFacilityRelatePharmacy = (
        rCreateHealthFacilityRelatePharmacy as any
      ).inject({ client: tx })
      const healthFacilityRelatePharmacyParams: any = {
        healthFacilityId: resultCreateHealthFacility.id,
        pharmacyId: params.pharmacyId,
        startDate: params.startDate,
        billingType: params.billingType,
        paymentType: params.paymentType,
        accountManageId: params.accountManageId,
        patientSortType: params.patientSortType,
      }
      const resultCreateHealthFacilityRelatePharmacy = await tCreateHealthFacilityRelatePharmacy(
        healthFacilityRelatePharmacyParams,
      )

      // 施設コード管理作成
      const tCreateHealthFacilityCodeManage: typeof rCreateHealthFacilityCodeManage = (
        rCreateHealthFacilityCodeManage as any
      ).inject({ client: tx })
      const healthFacilityCodeManageParams: any = {
        healthFacilityCodeGroupId: relatedEntitiesData.company?.healthFacilityCodeGroup?.id,
        healthFacilityId: resultCreateHealthFacility.id,
        code,
      }
      const resultCreateHealthFacilityCodeManage = await tCreateHealthFacilityCodeManage(healthFacilityCodeManageParams)

      return {
        resultCreateHealthFacility,
        resultCreateHealthFacilityRelatePharmacy,
        resultCreateHealthFacilityCodeManage,
      }
    })
  },
)

/**
 * 施設作成時の施設コードを採番します。
 * @param formatType 施設コードグループのフォーマットタイプ
 */
const createHealthFacilityCode = async (codeGroupId: string, formatType: HealthFacilityCodeGroupFormatType) => {
  // 現在のコードの最大値から新しいコードを取得
  const assignableCodes = getHealthFacilityNonAssignableCodes(formatType)
  const maxCode: any = (await getMaxCode(codeGroupId, assignableCodes)) || { code: '0' }
  let newCodeNumber: number = Number(maxCode.code) + 1

  // 新しいコードが欠番だった場合の回避処理
  while (assignableCodes.some((code) => parseInt(code) === newCodeNumber)) {
    newCodeNumber += 1
  }
  if (formatType === HealthFacilityCodeGroupFormatType.SIMPLE) {
    return newCodeNumber.toString()
  }
  return newCodeNumber.toString().padStart(4, '0')
}

/**
 * 指定の施設情報を更新します。
 * @param id 施設ID
 * @param params 施設情報
 */
export const updateHealthFacility: any = depend(
  { update },
  async ({ update }, id: string, params: HealthFacilityEditingDto) => {
    // 請求種別が「一括請求」以外は支払い種別と口座管理IDの値をクリアする
    if (params.billingType !== 'BATCH') {
      params.paymentType = null
      params.accountManageId = null
    }
    // 支払い種別が「振込」以外は口座管理IDの値をクリアする
    if (params.paymentType !== 'TRANSFER') {
      params.accountManageId = null
    }
    return await performTransaction(async (tx: any) => {
      const tUpdate: typeof update = (update as any).inject({ client: tx })
      return await tUpdate(id, params)
    })
  },
)

/**
 * 指定IDの施設情報を論理削除します。
 * @param id 施設ID
 * @return 施設情報
 */
export const archiveHealthFacility = depend({ archive }, async ({ archive }, id: string) => {
  return await performTransaction(async (tx: any) => {
    const tArchive: typeof archive = (archive as any).inject({ client: tx })
    return await tArchive(id)
  })
})
