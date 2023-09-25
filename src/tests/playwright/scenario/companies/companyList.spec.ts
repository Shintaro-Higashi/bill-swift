import { test, expect } from '@playwright/test'
import { CompanyListPage } from '@/tests/playwright/pages/companies/CompanyListPage'

/**
 * 会社一覧e2eテスト内容を定義します。
 */
test.describe('会社マスタ管理', () => {
  test('会社一覧', async ({ page }) => {
    const targetPage = new CompanyListPage(page)
    await targetPage.goto()
    await expect(page.getByRole('cell', { name: '会社000' })).toBeVisible()
  })
})
