describe('R8UC1', () => {
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


  it("add todo", () => {
    cy.get('[id$=title]').type(`${uid}`)
    cy.get('input[type=submit]').click()
    cy.get('[class=title-overlay]').contains(`${uid}`).click()
    cy.get('[class=inline-form]').type("new todo")
    cy.get('[class=inline-form]')
      .submit()

    cy.get('li.todo-item').should('have.length', 2)
  })

  it("add todo with empty field", () => {

    cy.get('[class=title-overlay]').contains(`${uid}`).click()
    cy.contains('Add').should('be.disabled')

  })


  after(function () {
    // clean up by deleting all tasks of the user
    // The url is not working, so no tasks can be deleted at the moment.
    // cy.request({
    //   method: 'GET',
    //   url: `http://localhost:${port}/tasks/ofuser/${uid}`
    // }).then((response) => {
    //   cy.log(response.body)
    //   for (let tasks in response.body) {
    //     cy.request({
    //       method: 'DELETE',
    //       url: `http://localhost:${port}/tasks/byid/${tasks._id}`
    //     })
    //   }
    // })

    // clean up by deleting the user from the database
    cy.request({
      method: 'DELETE',
      url: `http://localhost:${port}/users/${uid}`
    }).then((response) => {
      cy.log(response.body)
    })
  })
})

describe('R8UC2', () => {
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

  it("strike todo", () => {
    cy.get('[id$=title]').type(`${uid}`)
    cy.get('input[type=submit]').click()
    cy.get('[class=title-overlay]').contains(`${uid}`).click()

    cy.get('.checker').first().click()
    // Assert that the css property is changed to line thorough
    cy.get('ul li .editable').first().should('have.css', 'text-decoration', 'line-through solid rgb(49, 46, 46)')
  })

  it("activate todo", () => {
    cy.get('[class=title-overlay]').contains(`${uid}`).click()
    cy.get('.checker').first().click()
    cy.get('ul li .editable').first().should('have.css', 'text-decoration', 'none solid rgb(49, 46, 46)')
  })

  after(function () {
    // clean up by deleting all tasks of the user
    // The url is not working, so no tasks can be deleted at the moment.
    // cy.request({
    //   method: 'GET',
    //   url: `http://localhost:${port}/tasks/ofuser/${uid}`
    // }).then((response) => {
    //   cy.log(response.body)
    //   for (let tasks in response.body) {
    //     cy.request({
    //       method: 'DELETE',
    //       url: `http://localhost:${port}/tasks/byid/${tasks._id}`
    //     })
    //   }
    // })

    // clean up by deleting the user from the database
    cy.request({
      method: 'DELETE',
      url: `http://localhost:${port}/users/${uid}`
    }).then((response) => {
      cy.log(response.body)
    })
  })
})

describe('R8UC3', () => {
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

  // Add test set up with task and todo 

  it("remove todo", () => {
    cy.get('[id$=title]').type(`${uid}`)
    cy.get('input[type=submit]').click()
    cy.get('[class=title-overlay]').contains(`${uid}`).click()
    cy.get('.remover').last().click()
    cy.get('li.todo-item').should('have.length', 1)

  })

  it("demo: remove todo with two clicks", () => {
    // Some times to remove the todo item two click are needed. When tested with manual user test the item is sometimes removed the first time and sometimes two click are needed.
    cy.get('[class=title-overlay]').contains(`${uid}`).click()
    cy.get('.remover').last().click()
    cy.get('.remover').last().click()

    cy.get('li.todo-item').should('have.length', 1)

  })





  after(function () {
    // clean up by deleting all tasks of the user
    // The url is not working, so no tasks can be deleted at the moment.
    // cy.request({
    //   method: 'GET',
    //   url: `http://localhost:${port}/tasks/ofuser/${uid}`
    // }).then((response) => {
    //   cy.log(response.body)
    //   for (let tasks in response.body) {
    //     cy.request({
    //       method: 'DELETE',
    //       url: `http://localhost:${port}/tasks/byid/${tasks._id}`
    //     })
    //   }
    // })

    // clean up by deleting the user from the database
    cy.request({
      method: 'DELETE',
      url: `http://localhost:${port}/users/${uid}`
    }).then((response) => {
      cy.log(response.body)
    })
  })
})