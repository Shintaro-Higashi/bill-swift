import { fetchPharmacy } from '@/servers/services/pharmacyService'
import { fetchCompany } from '@/servers/services/companyService'

/**
 * 店舗が所属する変更前と変更後の会社が同一の施設コードグループであるか検証します。
 * <pre>
 *  店舗が所属する会社は患者番号体系が異なる会社に変更することはできません。
 * </pre>
 * @param pharmacyId 店舗ID
 * @param companyId  変更する会社ID
 */
export const validatePharmacyChangedCompany = async (
  pharmacyId: string | null | undefined,
  companyId: string | null | undefined,
) => {
  if (!pharmacyId || !companyId) return true
  const pharmacy = await fetchPharmacy(pharmacyId)
  const newCompany = await fetchCompany(companyId)
  return pharmacy.company.healthFacilityCodeGroupId === newCompany.healthFacilityCodeGroupId
}
// 店舗が所属する会社変更バリデーションエラーメッセージ
export const validatePharmacyChangedCompanyMessage = '施設コードグループが異なる会社に変更することはできません'
