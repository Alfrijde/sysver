describe('Managing todos', () => {
  // define variables that we need on multiple occasions
  let uid // user id
  let name // name of the user (firstName + ' ' + lastName)
  let email // email of the user

  const port = 5500

  before(function () {
    // create a fabricated user from a fixture
    cy.fixture('user.json')
      .then((user) => {
        cy.request({
          method: 'POST',
          url: `http://localhost:${port}/users/create`,
          form: true,
          body: user
        }).then((response) => {
          uid = response.body._id.$oid
          name = user.firstName + ' ' + user.lastName
          email = user.email
        })
      })
  })

  beforeEach(function () {
    cy.viewport(1280, 1020)
    // enter the main main page
    cy.visit('http://localhost:3000')

    // detect a div which contains "Email Address", find the input and type (in a declarative way)
    cy.contains('div', 'Email Address')
      .find('input[type=text]')
      .type(email)

    // submit the form on this page
    cy.get('form')
      .submit()
  })

  it("add a todo with empty title field", () => {
      cy.get('[id$=title]').clear()
      cy.get('input[type=submit]').should('be.disabled')
  })

  it("add a todo with filled out fields", () => {
      cy.get('[id$=title]').type(`${uid}`)
      cy.get('input[type=submit]').click()
      cy.get('[class=title-overlay]').contains(`${uid}`).should('have.text', `${uid}`)
  })

  it("strike todo", () => {
    cy.get('[class=title-overlay]').contains(`${uid}`).click()
    cy.get('.checker.unchecked').click()
    cy.get('ul li .editable').should('have.css', 'text-decoration', 'line-through solid rgb(49, 46, 46)')
  })

  it("activate todo", () => {
    cy.get('[class=title-overlay]').contains(`${uid}`).click()
    cy.get('.checker.checked').click()
    cy.get('ul li .editable').should('have.css', 'text-decoration', 'none solid rgb(49, 46, 46)')
  })

  it("remove todo", () => {
    cy.get('[class=title-overlay]').contains(`${uid}`).click()
    cy.get('.remover').click()
    cy.get('.todo-list').should('have.length', 1)
  })

  after(function () {
    // clean up by deleting the user from the database
    cy.request({
      method: 'DELETE',
      url: `http://localhost:${port}/users/${uid}`
    }).then((response) => {
      cy.log(response.body)
    })
  })
})