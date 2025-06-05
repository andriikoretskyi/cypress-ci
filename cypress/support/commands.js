// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('openHomePage', () => {
    const loginBody = {
        "user": {
            //Cypress.env('envName') is used to pass the env variables. cypress.env.json is used to override the env variables from ->
            //cypress.config.js file, but should be used only locally
            "email": Cypress.env('email'),
            "password": Cypress.env('password')
        }
    }

    cy.request('POST', 'https://conduit-api.bondaracademy.com/api/users/login', loginBody)
        .its('body').then(body => {
            const accessToken = body.user.token

            cy.wrap(accessToken).as('accessToken');

            cy.visit('/', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('jwtToken', accessToken);
                }
            });
        })
    // cy.contains('a', ' Sign in ').click();
    // cy.get('[placeholder="Email"]').type('emailtest@gmail.com');
    // cy.get('[placeholder="Password"]').type('123456aA!');
    // cy.contains('button', ' Sign in ').click();
})

//test-cypress-api
//emailtest@gmail.com
//123456aA!