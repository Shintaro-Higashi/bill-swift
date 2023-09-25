import { chromium, type FullConfig } from 'playwright/test'
import { LoginPage } from '@/tests/playwright/pages/login/LoginPage'

/**
 * テスト前に一度だけ実地するsetup処理です。
 * <pre>
 *  ログイン後、認証情報を保存して各テストの事前認証処理をスキップ可能とします
 * </pre>
 * @param config
 */
const globalSetup = async (config: FullConfig) => {
  // loginして 認証情報をstorageStateへ保存
  const { baseURL, storageState } = config.projects[0].use
  const browser = await chromium.launch({ timeout: 5 * 1000 })
  const page = await browser.newPage({ baseURL })
  await page.goto(baseURL!)
  const loginPage = new LoginPage(page)
  await loginPage.login()
  await page.context().storageState({ path: storageState as string })
  await browser.close()
}
export default globalSetup
