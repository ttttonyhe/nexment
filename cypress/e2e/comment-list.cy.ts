describe("Comment List", () => {
	beforeEach(() => {
		cy.visit("/")
	})

	it("loads and displays comments from the backend", () => {
		cy.get(".nexment-comments-list", { timeout: 10000 }).should("exist")
	})

	it("renders comment items with avatar and content", () => {
		cy.get(".nexment-comments-list", { timeout: 10000 }).should("exist")

		cy.get(".nexment-comments-div").each(($el) => {
			cy.wrap($el).find(".nexment-comments-avatar img").should("exist")
			cy.wrap($el).find(".nexment-comments-title").should("exist")
			cy.wrap($el).find(".nexment-comments-content").should("exist")
		})
	})

	it("renders comment timestamps", () => {
		cy.get(".nexment-comments-list", { timeout: 10000 }).should("exist")

		cy.get(".nexment-comments-title h5 b").should("have.length.at.least", 1)
	})

	it("renders reply buttons on comments", () => {
		cy.get(".nexment-comments-list", { timeout: 10000 }).should("exist")

		cy.get(".nexment-reply-icon, .nexment-reply-icon-reply").should(
			"have.length.at.least",
			1
		)
	})

	it("shows replying-to banner when reply button is clicked", () => {
		cy.get(".nexment-comments-list", { timeout: 10000 }).should("exist")

		// Reply buttons are display:none until parent :hover (CSS),
		// use force:true since Cypress can't trigger native CSS hover
		cy.get(".nexment-reply-icon").first().click({ force: true })

		cy.get(".nexment-comment-area-replying-to").should("exist")
		cy.get(".nexment-comment-area-replying-to").should(
			"contain.text",
			"Replying to"
		)
	})

	it("cancels reply when cancel button is clicked", () => {
		cy.get(".nexment-comments-list", { timeout: 10000 }).should("exist")

		cy.get(".nexment-reply-icon").first().click({ force: true })
		cy.get(".nexment-comment-area-replying-to").should("exist")

		cy.get(".nexment-comment-area-replying-to-cta button").click()
		cy.get(".nexment-comment-area-replying-to").should("not.exist")
	})
})
