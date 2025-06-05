/// <reference types="cypress" />

describe('First suite', () => {
    beforeEach('Visit Home page', () => {
        cy.openHomePage();
    })

    it('Create article', () => {
        //intercept method should be called before the actual api call, and then used after the api call happened
        cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/').as('postArticle');

        cy.contains('a', 'New Article').click();
        cy.get('[placeholder="Article Title"]').type('Article Title');
        cy.get(`[placeholder="What's this article about?"]`).type('Article Description');
        cy.get('[placeholder="Write your article (in markdown)"]').type('Actual Article');
        cy.get('[placeholder="Enter tags"]').type('Tag');
        cy.contains('button', 'Publish Article').click();

        cy.wait('@postArticle').then(xhr => {
            console.log(xhr);
            expect(xhr.response.statusCode).to.equal(201);
        })
    })

    it('Mocking the response', () => {
        //An object under JSON.stringify can also be directly passed as a response body
        cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', { fixture: 'tags.json' });
        cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles*', { fixture: 'articles.json' });

        cy.get('div.tag-list').then(tagList => {
            cy.wrap(tagList).find('a').first().should('contain', 'Test Tag 1');
            cy.wrap(tagList).find('a').eq(1).should('contain', 'Test Tag 2');
            cy.wrap(tagList).find('a').eq(2).should('contain', 'Test Tag 3');
        })

        cy.fixture('articles').then(file => {
            const slug = file.articles[0].slug;

            file.articles[0].favoritesCount = 50

            cy.intercept('POST', `https://conduit-api.bondaracademy.com/api/articles/${slug}/favorite`, file);
        })

        cy.get('app-favorite-button button').first().click().should('contain', '50');
    })


    it('Intercepting and changing the response', () => {
        cy.intercept('POST', '**articles', (req) => {
            req.reply(res => {
                expect(res.body.article.description).to.equal('Article Description')
                res.body.article.description = 'Article Description Edited'
            })
        }).as('postArticle');

        cy.intercept('POST', '**articles').as('postArticle');

        cy.contains('a', 'New Article').click();
        cy.get('[placeholder="Article Title"]').type('Article Title');
        cy.get(`[placeholder="What's this article about?"]`).type('Article Description');
        cy.get('[placeholder="Write your article (in markdown)"]').type('Actual Article');
        cy.get('[placeholder="Enter tags"]').type('Tag');
        cy.contains('button', 'Publish Article').click();

        cy.wait('@postArticle').then(xhr => {
            console.log(xhr);
            expect(xhr.response.statusCode).to.equal(201);
            expect(xhr.response.body.article.description).to.equal('Article Description Edited')
        })
    })

    //{retries: {number}} overrides the retries value saved in the config file for a specific test
    it.only('Sending requests via Cypress', {retries: 1}, () => {
        const articleBody = {
            "article": {
                "body": "About article",
                "description": "About article",
                "tagList": [
                    "Tag"
                ],
                "title": "New Article"
            }
        }

        cy.get('@accessToken').then(accessToken => {

            cy.request({
                method: 'POST',
                url: 'https://conduit-api.bondaracademy.com/api/articles/',
                headers: {
                    'Authorization': 'Token ' + accessToken,
                    'Content-Type': 'application/json'
                },
                body: articleBody
            }).then(res => {
                expect(res.status).to.equal(201);
            })
        })
    })
})