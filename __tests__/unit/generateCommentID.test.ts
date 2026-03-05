import generateCommentID from "../../src/lib/utils/generateCommentID"

describe("generateCommentID", () => {
	it("returns a number", () => {
		expect(typeof generateCommentID()).toBe("number")
	})

	it("returns a value based on Date.now", () => {
		const before = Date.now()
		const id = generateCommentID()
		const after = Date.now() + 11
		expect(id).toBeGreaterThanOrEqual(before)
		expect(id).toBeLessThanOrEqual(after)
	})

	it("adds a random offset between 1 and 10", () => {
		const now = Date.now()
		const id = generateCommentID()
		const offset = id - now
		expect(offset).toBeGreaterThanOrEqual(0)
		expect(offset).toBeLessThanOrEqual(11)
	})
})
