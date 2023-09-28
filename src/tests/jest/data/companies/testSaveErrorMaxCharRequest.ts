import { CompanyCreationRequest } from '@/types'

const nameKana = '１２３４５６７８９｜'.repeat(Math.ceil(128 / 13)).slice(0, 128)
export const testSaveErrorMaxCharRequest: CompanyCreationRequest = {
  name: '１２３４５６７８９｜１２３４５６７８９｜１２３４５６７８９｜１２Z',
  nameKana,
  postalCode: '1112222ZZ',
  address1: '１２３４５６７８９｜１２３４５６７８９｜Z',
  address2: '１２３４５６７８９｜１２３４５６７８９｜Z',
  tel: '１２３４５６７８９｜１２３４５６Z',
  fax: '１２３４５６７８９｜１２３４５６Z',
  healthFacilityCodeGroupId: '1',
}
