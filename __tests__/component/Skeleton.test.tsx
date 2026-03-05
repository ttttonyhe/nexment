import React from "react"
import { render } from "@testing-library/react"
import CommentSkeleton from "../../src/components/sections/Skeleton"

describe("CommentSkeleton", () => {
	it('renders with "full" variant by default', () => {
		const { container } = render(<CommentSkeleton />)
		expect(container.querySelector(".nexment-loading")).toBeTruthy()
	})

	it('renders with "compact" variant', () => {
		const { container } = render(<CommentSkeleton variant="compact" />)
		expect(container.querySelector(".nexment-loading-index")).toBeTruthy()
	})

	it("renders shimmer animation keyframes", () => {
		const { container } = render(<CommentSkeleton />)
		const style = container.querySelector("style")
		expect(style?.textContent).toContain("nexment-shimmer")
	})

	it("renders avatar circle and content lines", () => {
		const { container } = render(<CommentSkeleton />)
		const divs = container.querySelectorAll("div > div > div")
		expect(divs.length).toBeGreaterThan(0)
	})

	it("full variant renders more elements than compact", () => {
		const { container: full } = render(<CommentSkeleton variant="full" />)
		const { container: compact } = render(<CommentSkeleton variant="compact" />)
		expect(full.querySelectorAll("div").length).toBeGreaterThan(
			compact.querySelectorAll("div").length
		)
	})
})
