import { getBestLanguage } from "../../src/lib/translation"

describe("getBestLanguage", () => {
	const originalNavigator = global.navigator

	afterEach(() => {
		Object.defineProperty(global, "navigator", {
			value: originalNavigator,
			writable: true,
		})
	})

	it("returns 'en' for English locale", () => {
		Object.defineProperty(global, "navigator", {
			value: { language: "en-US" },
			writable: true,
		})
		expect(getBestLanguage()).toBe("en")
	})

	it("returns 'zh' for Chinese locale", () => {
		Object.defineProperty(global, "navigator", {
			value: { language: "zh-CN" },
			writable: true,
		})
		expect(getBestLanguage()).toBe("zh")
	})

	it("falls back to 'en' for unsupported locale", () => {
		Object.defineProperty(global, "navigator", {
			value: { language: "fr-FR" },
			writable: true,
		})
		expect(getBestLanguage()).toBe("en")
	})
})

describe("translate.use", () => {
	it("returns an object with text containing all translation keys", () => {
		// Re-import to get fresh module
		const translate = require("../../src/lib/translation").default
		const { text } = translate.use()

		expect(text.comments).toBeDefined()
		expect(text.submit).toBeDefined()
		expect(text.name).toBeDefined()
		expect(text.email).toBeDefined()
		expect(text.noComments).toBeDefined()
		expect(text.reply).toBeDefined()
		expect(text.verification).toBeDefined()
	})
})
