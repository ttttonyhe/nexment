import formatLink from "../../src/lib/utils/linkFormatter"

describe("formatLink", () => {
	it("returns http links unchanged", () => {
		expect(formatLink("http://example.com")).toBe("http://example.com")
	})

	it("returns https links unchanged", () => {
		expect(formatLink("https://example.com")).toBe("https://example.com")
	})

	it("prepends // to links without protocol", () => {
		expect(formatLink("example.com")).toBe("//example.com")
	})

	it("handles empty string", () => {
		expect(formatLink("")).toBe("")
	})
})
