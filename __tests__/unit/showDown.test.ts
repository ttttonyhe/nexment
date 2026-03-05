import { renderMarkdown } from "../../src/lib/utils/showDown"

describe("renderMarkdown", () => {
	it("converts markdown bold to HTML", () => {
		const result = renderMarkdown("**bold**")
		expect(result).toContain("<strong>bold</strong>")
	})

	it("converts markdown italic to HTML", () => {
		const result = renderMarkdown("*italic*")
		expect(result).toContain("<em>italic</em>")
	})

	it("converts inline code to HTML", () => {
		const result = renderMarkdown("`code`")
		expect(result).toContain("<code>code</code>")
	})

	it("converts links to HTML with href", () => {
		const result = renderMarkdown("[link](https://example.com)")
		expect(result).toContain('href="https://example.com"')
		expect(result).toContain("<a")
	})

	it("converts strikethrough to HTML", () => {
		const result = renderMarkdown("~~deleted~~")
		expect(result).toContain("<del>deleted</del>")
	})

	it("sanitizes script tags", () => {
		const result = renderMarkdown('<script>alert("xss")</script>')
		expect(result).not.toContain("<script>")
	})

	it("sanitizes onerror attributes", () => {
		const result = renderMarkdown('<img src=x onerror="alert(1)">')
		expect(result).not.toContain("onerror")
	})

	it("caches repeated conversions", () => {
		const input = "cached **test**"
		const first = renderMarkdown(input)
		const second = renderMarkdown(input)
		expect(first).toBe(second)
	})

	it("converts simple line breaks", () => {
		const result = renderMarkdown("line1\nline2")
		expect(result).toContain("<br")
	})

	it("converts headers", () => {
		const result = renderMarkdown("# Heading")
		expect(result).toContain("<h1")
		expect(result).toContain("Heading")
	})
})
