import { fetchHealthFacilityRelatePharmacy as fetch } from '@/servers/repositories/healthFacilityRelatePharmacyRepository'
import depend from '@/core/utils/velona'

/**
 * 指定IDの施設関連薬局を取得します。
 * @param id 施設関連薬局ID
 * @return 施設関連薬局情報
 */
export const fetchHealthFacilityRelatePharmacy = depend({ fetch }, async ({ fetch }, id: string) => {
  return await fetch(id)
})
