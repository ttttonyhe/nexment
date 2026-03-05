import { defineConfig } from "cypress"

export default defineConfig({
	allowCypressEnv: false,
	e2e: {
		baseUrl: "http://localhost:6006",
		supportFile: "cypress/support/e2e.ts",
		specPattern: "cypress/e2e/**/*.cy.ts",
		video: false,
		screenshotOnRunFailure: false,
	},
})
