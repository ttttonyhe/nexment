import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import NexmentDialog from "../../src/components/modal/Dialog"

describe("NexmentDialog", () => {
	beforeEach(() => {
		// jsdom doesn't implement HTMLDialogElement.showModal
		HTMLDialogElement.prototype.showModal =
			HTMLDialogElement.prototype.showModal ||
			function (this: HTMLDialogElement) {
				this.setAttribute("open", "")
			}
		HTMLDialogElement.prototype.close =
			HTMLDialogElement.prototype.close ||
			function (this: HTMLDialogElement) {
				this.removeAttribute("open")
			}
	})

	it("renders children when open", () => {
		render(
			<NexmentDialog open={true} onClose={jest.fn()}>
				<span>Dialog Content</span>
			</NexmentDialog>
		)
		expect(screen.getByText("Dialog Content")).toBeTruthy()
	})

	it("renders with fade animation class", () => {
		const { container } = render(
			<NexmentDialog open={true} onClose={jest.fn()} animation="fade">
				<span>Test</span>
			</NexmentDialog>
		)
		expect(
			container.querySelector(".nexment-dialog-fade")
		).toBeTruthy()
	})

	it("renders with slideUp animation class", () => {
		const { container } = render(
			<NexmentDialog open={true} onClose={jest.fn()} animation="slideUp">
				<span>Test</span>
			</NexmentDialog>
		)
		expect(
			container.querySelector(".nexment-dialog-slideUp")
		).toBeTruthy()
	})

	it("applies custom className", () => {
		const { container } = render(
			<NexmentDialog
				open={true}
				onClose={jest.fn()}
				className="nexment-modal-replies"
			>
				<span>Test</span>
			</NexmentDialog>
		)
		expect(
			container.querySelector(".nexment-modal-replies")
		).toBeTruthy()
	})

	it("renders a close button with aria-label", () => {
		render(
			<NexmentDialog open={true} onClose={jest.fn()}>
				<span>Test</span>
			</NexmentDialog>
		)
		const closeBtn = screen.getByRole("button", { name: "Close" })
		expect(closeBtn).toBeTruthy()
	})

	it("adds closing class when close button is clicked", () => {
		const onClose = jest.fn()
		const { container } = render(
			<NexmentDialog open={true} onClose={onClose}>
				<span>Test</span>
			</NexmentDialog>
		)

		const closeBtn = screen.getByRole("button", { name: "Close" })
		fireEvent.click(closeBtn)

		const dialog = container.querySelector("dialog")
		expect(
			dialog?.classList.contains("nexment-dialog-closing")
		).toBe(true)
	})
})
