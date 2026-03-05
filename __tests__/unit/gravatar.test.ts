import { getGravatarUrl } from "../../src/lib/utils/gravatar"
import { md5 } from "js-md5"

describe("getGravatarUrl", () => {
	it("returns a gravatar URL with md5 hash of the email", () => {
		const email = "test@example.com"
		const hash = md5(email)
		expect(getGravatarUrl(email)).toBe(
			`https://gravatar.loli.net/avatar/${hash}?d=mp`
		)
	})

	it("returns consistent URLs for the same email (caching)", () => {
		const email = "cached@test.com"
		const first = getGravatarUrl(email)
		const second = getGravatarUrl(email)
		expect(first).toBe(second)
	})

	it("returns different URLs for different emails", () => {
		expect(getGravatarUrl("a@test.com")).not.toBe(
			getGravatarUrl("b@test.com")
		)
	})
})
