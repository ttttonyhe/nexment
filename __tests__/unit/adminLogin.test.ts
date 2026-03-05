import type { NexmentConfig } from "../../src/lib/utils/configContext"

const mockBackend = {
	initAuth: jest.fn(),
	signIn: jest.fn(),
	signUp: jest.fn(),
	signOut: jest.fn(),
	queryComments: jest.fn(),
	insertComment: jest.fn(),
	updateComment: jest.fn(),
	getComment: jest.fn(),
}

jest.mock("../../src/lib/database/initiation", () => ({
	__esModule: true,
	default: () => mockBackend,
	getCurrentUser: jest.fn(() => null),
	setCurrentUser: jest.fn(),
	initAuth: jest.fn(),
}))

import adminLogin from "../../src/lib/database/adminLogin"
import { setCurrentUser } from "../../src/lib/database/initiation"

const config: NexmentConfig = {
	supabase: { url: "https://test.supabase.co", anonKey: "test-key" },
	admin: { name: "Admin", email: "admin@test.com" },
}

describe("adminLogin", () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("returns 200 on successful sign in", async () => {
		mockBackend.signIn.mockResolvedValue({
			user: { id: "1", email: "admin@test.com", name: "Admin" },
		})

		const result = await adminLogin(
			"Admin",
			"admin@test.com",
			"password",
			config
		)

		expect(result.status).toBe(200)
		expect(result.msg).toBe("Login success")
		expect(setCurrentUser).toHaveBeenCalledWith({
			id: "1",
			email: "admin@test.com",
			name: "Admin",
		})
	})

	it("falls back to sign up when sign in returns no user", async () => {
		mockBackend.signIn.mockResolvedValue({ user: null })
		mockBackend.signUp.mockResolvedValue({
			user: { id: "2", email: "admin@test.com", name: "Admin" },
		})

		const result = await adminLogin(
			"Admin",
			"admin@test.com",
			"password",
			config
		)

		expect(result.status).toBe(200)
		expect(result.msg).toBe("Admin successfully registered")
	})

	it("returns 500 when both sign in and sign up fail", async () => {
		mockBackend.signIn.mockResolvedValue({ user: null })
		mockBackend.signUp.mockResolvedValue({ user: null })

		const result = await adminLogin(
			"Admin",
			"admin@test.com",
			"password",
			config
		)

		expect(result.status).toBe(500)
		expect(result.msg).toBe("Login failed")
	})

	it("returns 500 when sign in fails and required fields missing", async () => {
		mockBackend.signIn.mockResolvedValue({ user: null })

		const result = await adminLogin("", "admin@test.com", "password", config)

		expect(result.status).toBe(500)
	})
})
