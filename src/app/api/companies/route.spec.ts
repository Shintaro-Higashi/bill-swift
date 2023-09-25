/**
 * @jest-environment node
 */
import { describe, expect, test } from '@jest/globals'
import { GET, POST } from './route'
import { HTTP_STATUS } from '@/core/configs/constants'
import { NextRequest } from 'next/server'
import { CompanyCreationRequest, CompanyModel, CompanyQueryRequest, PaginationModel } from '@/types'
import { objectToQueryString } from '@/core/utils/requestUtil'
import { testSaveNormalRequest } from '@/tests/jest/data/companies/testSaveNormalRequest'
import { testSaveFullRequest } from '@/tests/jest/data/companies/testSaveFullRequest'
import { testSaveMinimumRequest } from '@/tests/jest/data/companies/testSaveMinimumRequest'
import { testSaveErrorMaxCharRequest } from '@/tests/jest/data/companies/testSaveErrorMaxCharRequest'
import { ZodError } from 'zod'
import { testSearchNormalResult } from '@/tests/jest/data/companies/testSearchNormalResult'
import { testSearchByNameResult } from '@/tests/jest/data/companies/testSearchByNameResult'

import { exceptItems } from '@/tests/jest/utils/exeptUtil'

const RESOURCE = {
  path: 'api/companies',
  url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/companies`,
} as const

describe(`/${RESOURCE.path}`, () => {
  describe('新規作成', () => {
    test(`正常/通常作成`, async () => {
      await exceptCreate(testSaveNormalRequest)
    })
    test(`正常/最大入力値`, async () => {
      await exceptCreate(testSaveFullRequest)
    })
    test(`正常/最小入力値`, async () => {
      await exceptCreate(testSaveMinimumRequest)
    })
    describe('異常/入力エラー', () => {
      testValidCreate()
    })
  })
  describe('検索', () => {
    // testSearchSortName()
    // testSearchSortUpdated()
    // testSearchPaging()
    // testValidQuery()
    test(`正常/条件_無し`, async () => {
      const result = await execSearch({})
      expect(result).toEqual(testSearchNormalResult)
    })
    test(`正常/条件_会社不一致レコード無し`, async () => {
      const result = await execSearch({ name: '会社XXXXXXX' })
      expect(result.count).toBe(0)
      expect(result.items.length).toBe(0)
    })
    test(`正常/条件_会社名`, async () => {
      const result = await execSearch({ name: '会社001' })
      expect(result).toEqual(testSearchByNameResult)
    })
    test(`正常/ソート_会社名昇順`, async () => {
      const result = await execSearch({ sort: 'name', order: 'asc' })
      expect(result.items[0].name).toEqual('会社000')
    })
    test(`正常/ソート_会社名降順`, async () => {
      const result = await execSearch({ sort: 'name', order: 'desc' })
      expect(result.items[0].name).toEqual('会社004')
    })
    test(`正常/ソート_更新日時昇順`, async () => {
      const result = await execSearch({ sort: 'updatedAt', order: 'asc' })
      expect(result.items[0].name).toEqual('会社000')
    })
    test(`正常/ソート_更新日時降順`, async () => {
      const result = await execSearch({ sort: 'updatedAt', order: 'desc' })
      expect(result.items[0].name).toEqual('会社004')
    })
    test(`正常/ページング_パラメータ`, async () => {
      await testSearchPaging()
    })
    describe('混在/検索条件', () => {
      testValidQuery()
    })
  })
})

async function testValidCreate() {
  test(`全項目未指定`, async () => {
    const errors = await execInvalidCreate({})
    // console.log('errors', errors)
    const codeType = { code: 'invalid_type', expected: 'string' }
    exceptItems(errors, ['name', 'postalCode', 'address1', 'telephone'], codeType)
  })
  test(`全項目空文字`, async () => {
    const errors = await execInvalidCreate({
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
    const errors = await execInvalidCreate(testSaveErrorMaxCharRequest)
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
 * 検索条件のテスト確認
 */
async function testSearchPaging() {
  const query: CompanyQueryRequest = {
    pageNo: 1,
    pageSize: 2,
  }

  const result = await execSearch(query)
  expect(result.count).toBe(5)
  expect(result.pageCount).toBe(3)
  expect(result.items.length).toBe(query.pageSize)
}

/**
 * 検索条件のテスト確認
 */
async function testValidQuery() {
  const query: CompanyQueryRequest = {
    name: '１２３４５６７８９|１２３４５６７８９|１２３４５６７８９|１２',
  }

  test(`検索条件/正常/会社名入力最大`, async () => {
    const result = await execSearch(query)
    expect(result.count).toEqual(0)
    expect(result.items.length).toEqual(0)
  })

  test(`検索条件/異常/会社名入力エラー`, async () => {
    query.name = '１２３４５６７８９|１２３４５６７８９|１２３４５６７８９|１２A'
    const errors = await execInValidSearch(query)
    expect(errors.length).toEqual(1)
    expect(errors[0]).toEqual(expect.objectContaining({ path: ['name'], code: 'too_big', maximum: 32, type: 'string' }))
  })
}

/**
 * 正常系の作成を実地します。
 * @param body
 */
async function execCreate(body: CompanyCreationRequest) {
  const request = new NextRequest(RESOURCE.url, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  // console.log('body', JSON.stringify(body))

  const response = await POST(request)
  const result = await response.json()
  // console.log('execCreate:result', result)
  expect(response.status).toBe(HTTP_STATUS.OK)
  return result as CompanyModel
}

/**
 * 作成処理の結果マッチングヘルパー
 * @param body
 */
async function exceptCreate(body: CompanyCreationRequest) {
  const result = await execCreate(body)
  // console.log('execCreate', result)
  expect(result).toStrictEqual(expect.objectContaining(body))
  expect(result.id).toBeTruthy()
  expect(result.createdBy).toEqual('1')
  expect(result.updatedBy).toEqual('1')
}

/**
 * エラー系の作成を実地します。
 * @param body
 */
async function execInvalidCreate(body: any) {
  const request = new NextRequest(RESOURCE.url, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  const response = await POST(request)
  expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
  const result = await response.json()
  return result.error as ZodError[]
}

/**
 * 正常系の検索を実地します
 * @param query 検索条件
 */
async function execSearch(query: CompanyQueryRequest) {
  const request = new NextRequest(RESOURCE.url + '?' + objectToQueryString(query))
  const response = await GET(request)
  expect(response.status).toBe(HTTP_STATUS.OK)
  return (await response.json()) as PaginationModel<CompanyModel>
}

/**
 * 入力エラー系の検索を実地します
 * @param query 検索条件
 */
async function execInValidSearch(query: CompanyQueryRequest) {
  const request = new NextRequest(RESOURCE.url + '?' + objectToQueryString(query))
  const response = await GET(request)
  expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
  const result = await response.json()
  return result.error as ZodError[]
}
