describe("Comment Flow", () => {
	beforeEach(() => {
		cy.visit("/")
	})

	it("renders the Nexment container", () => {
		cy.get(".nexment-container").should("exist")
	})

	it("renders the comment form with name, email, and textarea", () => {
		cy.get(".nexment-comment-area").should("exist")
		cy.get(".nexment-comment-area-top-name-input").should("exist")
		cy.get('.nexment-comment-area-top input[type="email"]').should("exist")
		cy.get(".nexment-comment-area-middle textarea").should("exist")
	})

	it("renders the link input when feature is enabled", () => {
		cy.get('.nexment-comment-area-top input[type="url"]').should("exist")
	})

	it("renders the comment header with count", () => {
		cy.get(".nexment-header h1").should("exist")
		cy.get(".nexment-header h1").should("contain.text", "Comments")
	})

	it("renders the powered by footer", () => {
		cy.get(".nexment-header-logo").should("contain.text", "Powered by")
	})

	it("renders toolbar buttons", () => {
		cy.get(".nexment-comment-area-toolbar button").should(
			"have.length.at.least",
			2
		)
	})

	it("renders the submit button", () => {
		cy.get(".nexment-comment-area-submit button").should("exist")
		cy.get(".nexment-comment-area-submit button").should(
			"contain.text",
			"Submit"
		)
	})

	it("allows typing in the comment fields", () => {
		cy.get(".nexment-comment-area-top-name-input")
			.clear()
			.type("Cypress User")
			.should("have.value", "Cypress User")

		cy.get('.nexment-comment-area-top input[type="email"]')
			.clear()
			.type("cypress@test.com")
			.should("have.value", "cypress@test.com")

		cy.get(".nexment-comment-area-middle textarea")
			.clear()
			.type("E2E test comment")
			.should("have.value", "E2E test comment")
	})

	it("shows gravatar when valid email is entered", () => {
		cy.get('.nexment-comment-area-top input[type="email"]')
			.clear()
			.type("test@example.com")

		cy.get(".nexment-comment-area-top-name-avatar img").should("exist")
		cy.get(".nexment-comment-area-top-name-avatar img")
			.should("have.attr", "src")
			.and("contain", "gravatar.loli.net/avatar/")
	})
})
