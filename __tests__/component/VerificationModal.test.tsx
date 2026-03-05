import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import VerificationModal from "../../src/components/modal/verification"
import Context, { NexmentConfig } from "../../src/lib/utils/configContext"

const mockAdminLogin = jest.fn()
jest.mock("../../src/lib/database/adminLogin", () => ({
	__esModule: true,
	default: (...args: any[]) => mockAdminLogin(...args),
}))

const config: NexmentConfig = {
	supabase: { url: "https://test.supabase.co", anonKey: "key" },
	admin: { name: "Admin", email: "admin@test.com" },
}

const renderModal = (visibilityFn = jest.fn()) => {
	// Polyfill dialog methods for jsdom
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

	return render(
		<Context.Provider value={config}>
			<VerificationModal config={config} visibilityFunction={visibilityFn} />
		</Context.Provider>
	)
}

describe("VerificationModal", () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("renders verification title", () => {
		renderModal()
		expect(screen.getByText("Verification")).toBeTruthy()
	})

	it("renders password input", () => {
		renderModal()
		const input = screen.getByPlaceholderText("Admin password")
		expect(input).toBeTruthy()
	})

	it("renders login button", () => {
		renderModal()
		expect(screen.getByText("Login")).toBeTruthy()
	})

	it("calls adminLogin with correct arguments when login is clicked", async () => {
		mockAdminLogin.mockResolvedValue({ status: 200, msg: "Login success" })
		renderModal()

		const input = screen.getByPlaceholderText("Admin password")
		fireEvent.change(input, { target: { value: "my-password" } })

		const loginBtn = screen.getByText("Login")
		fireEvent.click(loginBtn)

		await waitFor(() => {
			expect(mockAdminLogin).toHaveBeenCalledWith(
				"Admin",
				"admin@test.com",
				"my-password",
				config
			)
		})
	})

	it("shows Verifying... text while login is in progress", async () => {
		mockAdminLogin.mockImplementation(
			() => new Promise((resolve) => setTimeout(resolve, 1000))
		)
		renderModal()

		const loginBtn = screen.getByText("Login")
		fireEvent.click(loginBtn)

		expect(screen.getByText("Verifying...")).toBeTruthy()
	})

	it("shows alert on login failure", async () => {
		mockAdminLogin.mockResolvedValue({ status: 500, msg: "Login failed" })
		const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {})
		renderModal()

		const loginBtn = screen.getByText("Login")
		fireEvent.click(loginBtn)

		await waitFor(() => {
			expect(alertSpy).toHaveBeenCalledWith("Login failed")
		})

		alertSpy.mockRestore()
	})
})
