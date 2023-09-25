/**
 * @jest-environment node
 */

import { describe, expect, test } from '@jest/globals'
import { DELETE, GET, PATCH } from './route'
import { HTTP_STATUS } from '@/core/configs/constants'
import { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { CompanyEditingRequest, CompanyModel } from '@/types'
import { testGetOneResult } from '@/tests/jest/data/companies/testGetOneResult'
import { testSaveNormalRequest } from '@/tests/jest/data/companies/testSaveNormalRequest'
import { testSaveFullRequest } from '@/tests/jest/data/companies/testSaveFullRequest'
import { testSaveMinimumRequest } from '@/tests/jest/data/companies/testSaveMinimumRequest'
import { exceptItems } from '@/tests/jest/utils/exeptUtil'
import { testSaveErrorMaxCharRequest } from '@/tests/jest/data/companies/testSaveErrorMaxCharRequest'

const RESOURCE = {
  path: 'api/companies/[id]',
  url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/companies`,
} as const

const id = 'company000'
describe(`/${RESOURCE.path}/[id]`, () => {
  describe('詳細取得', () => {
    test(`正常`, async () => {
      const id = 'company000'
      const response = await GET(new NextRequest(`${RESOURCE.url}/${id}`), { params: { id } })
      const result = await response.json()
      expect(response.status).toBe(HTTP_STATUS.OK)
      expect(result).toEqual(testGetOneResult)
    })

    test(`異常/該当データ無し`, async () => {
      const id = 'not-found'
      const response = await GET(new NextRequest(`${RESOURCE.url}/${id}`), { params: { id } })
      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND)
    })
  })
  describe('更新', () => {
    test(`更新/通常更新`, async () => {
      await exceptEdit(id, testSaveNormalRequest)
    })
    test(`更新/最大入力値`, async () => {
      await exceptEdit(id, testSaveFullRequest)
    })
    test(`更新/最小入力値`, async () => {
      await exceptEdit(id, testSaveMinimumRequest)
    })
    describe('異常/入力エラー', () => {
      testValidEdit()
    })
  })
  describe('削除', () => {
    test(`正常`, async () => {
      const id = 'company000'
      const response = await DELETE(new NextRequest(`${RESOURCE.url}/${id}`), { params: { id } })
      expect(response.status).toBe(HTTP_STATUS.OK)
      const getOneResponse = await GET(new NextRequest(`${RESOURCE.url}/${id}`), { params: { id } })
      expect(getOneResponse.status).toBe(HTTP_STATUS.NOT_FOUND)
    })

    test(`異常/該当データ無し`, async () => {
      const id = 'not-found'
      const response = await DELETE(new NextRequest(`${RESOURCE.url}/${id}`), { params: { id } })
      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND)
    })
  })
})

async function testValidEdit() {
  test(`全項目未指定`, async () => {
    const errors = await execInvalidEdit(id, {})
    // console.log('errors', errors)
    const codeType = { code: 'invalid_type', expected: 'string' }
    exceptItems(errors, ['name', 'postalCode', 'address1', 'telephone'], codeType)
  })
  test(`全項目空文字`, async () => {
    const errors = await execInvalidEdit(id, {
      name: '',
      postalCode: '',
      address1: '',
      address2: '',
      telephone: '',
      fax: '',
    })
    // console.log('errors', errors)
    const codeType = { code: 'too_small', exact: false, minimum: 1 }
    exceptItems(errors, ['name', 'postalCode', 'address1', 'telephone'], codeType)
  })
  test(`文字数超過`, async () => {
    const errors = await execInvalidEdit(id, testSaveErrorMaxCharRequest)
    // console.log('errors', errors)
    const codeType = { code: 'too_big', exact: false }
    const items = [
      { path: ['name'], maximum: 32 },
      { path: ['postalCode'], maximum: 8 },
      { path: ['address1'], maximum: 20 },
      { path: ['address2'], maximum: 20 },
      { path: ['telephone'], maximum: 16 },
      { path: ['fax'], maximum: 16 },
    ]
    exceptItems(errors, items, codeType)
  })
}

/**
 * 正常系の更新を実地します。
 * @param id
 * @param body
 */
async function execEdit(id: string, body: CompanyEditingRequest) {
  const request = new NextRequest(RESOURCE.url, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
  // console.log('body', JSON.stringify(body))

  const response = await PATCH(request, { params: { id } })
  const result = await response.json()
  // console.log('execCreate:result', result)
  expect(response.status).toBe(HTTP_STATUS.OK)
  return result as CompanyModel
}

/**
 * 更新処理の結果マッチングヘルパー
 * @param id
 * @param body
 */
async function exceptEdit(id: string, body: CompanyEditingRequest) {
  const result = await execEdit(id, body)
  // console.log('execEdit', result)
  expect(result).toStrictEqual(expect.objectContaining(body))
  expect(result.id).toBeTruthy()
  expect(result.createdBy).toEqual('1')
  expect(result.updatedBy).toEqual('1')
}

/**
 * エラー系の更新を実地します。
 * @param id
 * @param body
 */
async function execInvalidEdit(id: string, body: any) {
  const request = new NextRequest(RESOURCE.url, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
  const response = await PATCH(request, { params: { id } })
  expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
  const result = await response.json()
  return result.error as ZodError[]
}
