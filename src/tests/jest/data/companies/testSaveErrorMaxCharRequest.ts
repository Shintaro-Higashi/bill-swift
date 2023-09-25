import { CompanyCreationRequest } from '@/types'

export const testSaveErrorMaxCharRequest: CompanyCreationRequest = {
  name: '１２３４５６７８９｜１２３４５６７８９｜１２３４５６７８９｜１２Z',
  postalCode: '1112222ZZ',
  address1: '１２３４５６７８９｜１２３４５６７８９｜Z',
  address2: '１２３４５６７８９｜１２３４５６７８９｜Z',
  telephone: '１２３４５６７８９｜１２３４５６Z',
  fax: '１２３４５６７８９｜１２３４５６Z',
}
