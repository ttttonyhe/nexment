import { scrollToElementById } from "../../src/lib/utils/scrollToElement"

describe("scrollToElementById", () => {
	beforeEach(() => {
		window.scrollTo = jest.fn()
	})

	it("does nothing when element does not exist", () => {
		scrollToElementById("nonexistent")
		expect(window.scrollTo).not.toHaveBeenCalled()
	})

	it("scrolls to the element when found", () => {
		const el = document.createElement("div")
		el.id = "target"
		Object.defineProperty(el, "offsetTop", { value: 500 })
		Object.defineProperty(el, "offsetParent", { value: null })
		document.body.appendChild(el)

		scrollToElementById("target")

		expect(window.scrollTo).toHaveBeenCalledWith({
			top: 400,
			behavior: "smooth",
		})

		document.body.removeChild(el)
	})
})
