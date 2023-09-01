/// <reference types="cypress" />
/// <reference types="../index.d.ts" />

const assertNotification = (ui: UITypes) => {
  switch (ui) {
    case 'material-ui':
      return cy.getMaterialUINotification().should('contain', 'Success')
  }
}

const waitLoadingOverlay = (ui: UITypes) => {
  switch (ui) {
    case 'material-ui':
      return cy.getMaterialUILoadingCircular().should('not.exist')
  }
}

const fillForm = (ui: UITypes) => {
  switch (ui) {
    case 'material-ui':
      return cy.fillMaterialUIForm()
  }
}

const assertFormShouldHaveResponseValues = (response: any, ui: UITypes) => {
  const body = response?.body

  // assert response values are equal to the form values
  switch (ui) {
    case 'material-ui':
      cy.get('#title').should('have.value', body?.title)
      cy.get('#content').should('have.value', body?.content)
      cy.get('#status').should('have.value', body?.status)
      cy.fixture('categories').then((categories) => {
        const category = categories.find((category: any) => category.id === body?.category?.id)
        cy.get('#category').should('have.value', category?.title)
      })
      break
  }
}

const assertSuccessResponse = (response: any, ui: UITypes) => {
  const body = response?.body

  expect(response?.statusCode).to.eq(200)
  expect(body).to.have.property('id')
  expect(body).to.have.property('category')

  cy.fixture('mock-post').then((mockPost) => {
    expect(body?.title).to.eq(mockPost.title)
    expect(body?.content).to.eq(mockPost.content)
    expect(body?.status?.toLowerCase()).to.eq(mockPost?.status?.toLowerCase())
  })

  assertNotification(ui)
  cy.location().should((loc) => {
    expect(loc.pathname).to.eq('/companies')
  })
}

export const list = () => {
  cy.url().should('include', '/companies')
  cy.getPageHeaderTitle().should('contain', 'companies')

  cy.assertDocumentTitle('companies', 'list')
}

export const create = ({ ui }: IResourceCreateParams) => {
  cy.interceptGETCategories()

  cy.getCreateButton().click()
  cy.wait('@getCategories')
  cy.location('pathname').should('eq', '/companies/create')

  cy.assertDocumentTitle('Post', 'create')

  fillForm(ui)

  cy.interceptPOSTPost()
  cy.getSaveButton().click()

  cy.wait('@postPost').then((interception) => {
    const response = interception?.response
    assertSuccessResponse(response, ui)
  })
}

export const edit = ({ ui }: IResourceEditParams) => {
  cy.interceptGETCategories()
  cy.interceptGETPost()

  // wait loading state and render to be finished
  cy.wait('@getCompanies')
  waitLoadingOverlay(ui)

  cy.getEditButton().first().click()
  cy.wait('@getCompanies').then((interception) => {
    const getResponse = interception?.response

    // wait loading state and render to be finished
    waitLoadingOverlay(ui)
    cy.getSaveButton().should('not.be.disabled')
    cy.location('pathname').should('include', '/posts/edit')

    assertFormShouldHaveResponseValues(getResponse, ui)
  })

  cy.assertDocumentTitle('Post', 'edit')

  fillForm(ui)

  cy.interceptPATCHPost()
  cy.getSaveButton().click()

  cy.wait('@patchPost').then((interception) => {
    const response = interception?.response
    assertSuccessResponse(response, ui)
  })
}

export const show = () => {
  cy.interceptGETPost()
  cy.interceptGETCategory()

  cy.getShowButton().first().click()

  cy.assertDocumentTitle('Post', 'show')

  cy.wait('@getPost').then((interception) => {
    const response = interception?.response

    const id = response?.body?.id
    cy.location('pathname').should('include', `/posts/show/${id}`)

    // should be visible id,title,content
    ;['Id', 'Title', 'Content'].forEach((field) => {
      cy.get('body').should('contain', field)
    })
    // should be visible id,title,content values
    const title = response?.body?.title
    const content = response?.body?.content
    ;[id, title, content].forEach((value) => {
      cy.get('body').should('contain', value)
    })
  })

  cy.wait('@getCategory').then((interception) => {
    const response = interception?.response

    const category = response?.body
    cy.get('body').should('contain', category?.title)
  })
}

export const resourceDelete = ({ ui }: IResourceDeleteParams) => {
  cy.interceptGETCategories()
  cy.wait('@getPosts')
  waitLoadingOverlay(ui)

  cy.interceptGETPost()
  cy.getEditButton().first().click()

  // wait loading state and render to be finished
  cy.wait('@getPost')
  waitLoadingOverlay(ui)
  cy.getSaveButton().should('not.be.disabled')

  cy.interceptDELETEPost()
  cy.getDeleteButton().first().click()
  switch (ui) {
    case 'material-ui':
      cy.getMaterialUIDeletePopoverButton().click({ force: true })
      break
  }

  cy.wait('@deletePost').then((interception) => {
    const response = interception?.response

    expect(response?.statusCode).to.eq(200)
    assertNotification(ui)
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/posts')
    })
  })
}
