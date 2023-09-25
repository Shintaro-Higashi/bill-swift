import type { Locator, Page } from '@playwright/test'
export class LoginPage {
  readonly page: Page
  readonly emailField: Locator
  readonly passwordField: Locator
  readonly rememberField: Locator
  readonly loginButton: Locator

  constructor(page: Page) {
    this.page = page
    this.emailField = page.getByRole('textbox', { name: 'email' })
    this.passwordField = page.getByRole('textbox', { name: 'password' })
    this.rememberField = page.getByRole('checkbox', { name: 'remember' })
    this.loginButton = page.getByRole('button', { name: 'ログイン' })
  }

  async goto() {
    await this.page.goto(`/login`)
  }

  getEmail() {
    return this.emailField.inputValue()
  }

  setEmail(email: string) {
    return this.emailField.fill(email)
  }

  getPassword() {
    return this.passwordField.inputValue()
  }

  setPassword(password: string) {
    return this.emailField.fill(password)
  }

  getRemember () {
    return this.rememberField.isChecked()
  }

  setRemember (checked: boolean) {
    return this.rememberField.setChecked(checked)
  }

  async login(email: string = 'demo555@upstream-j.co.jp', password: string = 'GoGoGo555444332211') {
    await this.goto()
    await this.emailField.clear()
    await this.emailField.fill(email)
    await this.passwordField.clear()
    await this.passwordField.fill(password)
    await this.loginButton.click()
    await this.page.waitForURL('/patients')
    await this.page.screenshot({ path: 'login-after.png', fullPage: true });
  }
}
