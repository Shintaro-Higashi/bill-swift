import { CompanyCreationRequest } from '@/types'

const nameKana = '１２３４５６７８９｜'.repeat(Math.ceil(128 / 13)).slice(0, 128)
export const testSaveFullRequest: CompanyCreationRequest = {
  name: '１２３４５６７８９｜１２３４５６７８９｜１２３４５６７８９｜１２',
  nameKana,
  postalCode: '1112222',
  address1: '１２３４５６７８９｜１２３４５６７８９｜',
  address2: '１２３４５６７８９｜１２３４５６７８９｜',
  tel: '１２３４５６７８９｜１２３４５６',
  fax: '１２３４５６７８９｜１２３４５６',
  healthFacilityCodeGroupId: '1',
}
