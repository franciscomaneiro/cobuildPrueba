/// <reference types="cypress" />


// describe('My First Test', () => {
//     it('Visits the cobuildTest vercel', () => {
//         cy.visit('https://cobuild-prueba.vercel.app/')
//     })
// })

context('Actions', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.wait(3000)
        cy.url().should('contain', 'https://606258015ada240007bd5979.auth.us-east-1.amazoncognito.com')
        cy.wait(5000)
        cy.get('#signInFormUsername')
            .type('franciscomaneiro97@gmail.com').should('have.value', 'franciscomaneiro97@gmail.com')
        cy.get('#signInFormPassword')
            .type('Fr4n1597534628a').should('have.value', 'Fr4n1597534628a')
    })

    it('.type() - type into tarea input', () => {
        cy.get('#tareaInput')
            .type('Prueba de type').should('have.value', 'Prueba de type')
    })
})