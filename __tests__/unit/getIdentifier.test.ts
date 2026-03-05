/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://example.com/test-page"}
 */
import getIdentifier from "../../src/lib/utils/getIdentifier"

describe("getIdentifier", () => {
	it("returns the current window.location.pathname", () => {
		expect(getIdentifier()).toBe("/test-page")
	})
})
