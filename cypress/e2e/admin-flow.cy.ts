describe("Admin Verification Flow", () => {
	beforeEach(() => {
		cy.visit("/")
	})

	it("shows verification modal when admin name is typed", () => {
		cy.get(".nexment-comment-area-top-name-input").clear().type("Tony He")

		// The modal should appear (dialog element)
		cy.get(".nexment-modal-notification").should("exist")
		cy.get(".nexment-modal-notification").within(() => {
			cy.contains("Verification").should("exist")
			cy.get('input[placeholder="Admin password"]').should("exist")
			cy.contains("Login").should("exist")
		})
	})

	it("shows verification modal when admin email is typed", () => {
		cy.get('.nexment-comment-area-top input[type="email"]')
			.clear()
			.type("tony.hlp@hotmail.com")

		cy.get(".nexment-modal-notification").should("exist")
	})

	it("can close verification modal via close button", () => {
		cy.get(".nexment-comment-area-top-name-input").clear().type("Tony He")
		cy.get(".nexment-modal-notification").should("exist")

		cy.get(".nexment-dialog-close").first().click()
		// Modal should animate out
		cy.get(".nexment-modal-notification", { timeout: 1000 }).should(
			"not.exist"
		)
	})
})
