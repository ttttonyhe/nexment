declare global {
	namespace Cypress {
		interface Chainable {
			fillCommentForm(name: string, email: string, content: string): Chainable
		}
	}
}

Cypress.Commands.add(
	"fillCommentForm",
	(name: string, email: string, content: string) => {
		cy.get(".nexment-comment-area-top-name-input").clear().type(name)
		cy.get('.nexment-comment-area-top input[type="email"]')
			.clear()
			.type(email)
		cy.get(".nexment-comment-area-middle textarea").clear().type(content)
	}
)

export {}
