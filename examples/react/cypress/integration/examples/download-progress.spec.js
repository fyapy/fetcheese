/// <reference types="cypress" />
// @ts-check

describe('Cypress', () => {
  it('visits the app', () => {
    cy.visit('/')
  })

  it('Should show donwload progress', () => {
    cy.get('[data-name="loaded"]')
      .should('have.text', 'Loaded: 0')
    cy.get('[data-is="loaded"]')
      .should('have.text', 'Is loaded: false')

    cy.get('button')
      .click()
    
    cy.get('[data-name="loaded"]')
      .should('not.have.text', 'Loaded: 0')
    cy.get('[data-is="loaded"]')
      .should('not.have.text', 'Is loaded: false')

  })
})
