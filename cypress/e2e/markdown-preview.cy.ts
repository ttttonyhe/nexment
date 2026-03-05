describe("Markdown Preview", () => {
	beforeEach(() => {
		cy.visit("/")
	})

	it("toggles markdown preview on and off", () => {
		cy.get(".nexment-comment-area-middle textarea")
			.clear()
			.type("**bold text**")

		// Click the markdown preview button (the one with markdown icon)
		cy.get(".nexment-comment-area-toolbar button").last().click()

		// Preview should appear
		cy.get(".nexment-md-preview").should("exist")
		cy.get(".nexment-md-preview").should("contain.html", "<strong>bold text</strong>")

		// Click again to close
		cy.get(".nexment-comment-area-toolbar button").last().click()

		// Preview should disappear
		cy.get(".nexment-md-preview").should("not.exist")
	})

	it("shows nothing message when preview is empty", () => {
		// Click the markdown preview button with no content
		cy.get(".nexment-comment-area-toolbar button").last().click()

		cy.get(".nexment-md-preview").should("exist")
		cy.get(".nexment-md-preview").should("contain.text", "Nothing to preview")
	})
})
