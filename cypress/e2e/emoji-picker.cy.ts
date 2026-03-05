describe("Emoji Picker", () => {
	beforeEach(() => {
		cy.visit("/")
	})

	it("opens emoji popover when emoji button is clicked", () => {
		cy.get(".nexment-comment-area-toolbar button").first().click()

		cy.get(".nexment-emoji-container", { timeout: 5000 }).should("exist")
	})

	it("renders emoji sections with headers", () => {
		cy.get(".nexment-comment-area-toolbar button").first().click()

		cy.get(".nexment-emoji-section", { timeout: 5000 }).should(
			"have.length.at.least",
			1
		)
		cy.get(".nexment-emoji-section-header b").should(
			"have.length.at.least",
			1
		)
	})

	it("inserts emoji into textarea when clicked", () => {
		cy.get(".nexment-comment-area-toolbar button").first().click()

		// Emoji spans may be clipped by overflow:hidden containers,
		// use force:true since we're testing the click handler, not scroll visibility
		cy.get(".nexment-emoji-section-container span", { timeout: 5000 })
			.first()
			.click({ force: true })

		cy.get(".nexment-comment-area-middle textarea").should(($textarea) => {
			expect($textarea.val()).to.have.length.greaterThan(0)
		})
	})

	it("closes emoji popover after emoji selection", () => {
		cy.get(".nexment-comment-area-toolbar button").first().click()
		cy.get(".nexment-emoji-container", { timeout: 5000 }).should("exist")

		cy.get(".nexment-emoji-section-container span").first().click({ force: true })

		cy.get(".nexment-emoji-container").should("not.exist")
	})
})
