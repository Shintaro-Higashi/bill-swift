import type { Locator, Page } from '@playwright/test'
export class CompanyListPage {
  readonly page: Page
  readonly idConditionField: Locator
  readonly nameConditionField: Locator
  readonly searchButton: Locator

  constructor(page: Page) {
    this.page = page
    this.idConditionField = page.getByRole('textbox', { name: 'id' })
    this.nameConditionField = page.getByRole('textbox', { name: 'name' })
    this.searchButton = page.getByRole('button', { name: '検索' })
  }

  async goto() {
    await this.page.goto(`/companies`)
  }

  getIdCondition() {
    return this.idConditionField.inputValue()
  }

  setIdCondition(id: string) {
    return this.idConditionField.fill(id)
  }

  getNameCondition() {
    return this.nameConditionField.inputValue()
  }

  setNameCondition(name: string) {
    return this.nameConditionField.fill(name)
  }

  async search({ id, name }: { id: string; name: string }) {
    await this.goto()
    await this.setIdCondition(id)
    await this.setNameCondition(name)
    await this.searchButton.click()
  }
}
