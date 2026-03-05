import React from "react"
import { render, screen } from "@testing-library/react"
import Icon from "../../src/components/icon"

describe("Icon", () => {
	it("renders the admin icon SVG", () => {
		const { container } = render(<Icon name="admin" />)
		const svg = container.querySelector("svg")
		expect(svg).toBeTruthy()
	})

	it("renders the reply icon SVG", () => {
		const { container } = render(<Icon name="reply" />)
		const svg = container.querySelector("svg")
		expect(svg).toBeTruthy()
		expect(svg?.getAttribute("width")).toBe("13")
	})

	it("renders the comments icon SVG", () => {
		const { container } = render(<Icon name="comments" />)
		const svg = container.querySelector("svg")
		expect(svg).toBeTruthy()
		expect(svg?.getAttribute("width")).toBe("36")
	})

	it("renders different icons for different names", () => {
		const { container: c1 } = render(<Icon name="emoji" />)
		const { container: c2 } = render(<Icon name="cancel" />)
		expect(c1.innerHTML).not.toBe(c2.innerHTML)
	})
})
