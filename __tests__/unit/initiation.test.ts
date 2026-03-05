jest.mock("../../src/lib/database/backends/supabase", () => ({
	createSupabaseBackend: jest.fn(() => ({
		initAuth: jest.fn().mockResolvedValue({
			id: "1",
			email: "admin@test.com",
			name: "Admin",
		}),
	})),
}))

jest.mock("../../src/lib/database/backends/neon", () => ({
	createNeonBackend: jest.fn(() => ({
		initAuth: jest.fn().mockResolvedValue(null),
	})),
}))

describe("initiation", () => {
	beforeEach(() => {
		jest.resetModules()
	})

	it("creates supabase backend for supabase config", () => {
		const { default: getBackend } = require("../../src/lib/database/initiation")
		const {
			createSupabaseBackend,
		} = require("../../src/lib/database/backends/supabase")

		const config = {
			supabase: { url: "https://test.supabase.co", anonKey: "key" },
			admin: { name: "Admin", email: "admin@test.com" },
		}

		const backend = getBackend(config)
		expect(createSupabaseBackend).toHaveBeenCalledWith(
			"https://test.supabase.co",
			"key"
		)
		expect(backend).toBeDefined()
	})

	it("caches backend instance on repeated calls", () => {
		const { default: getBackend } = require("../../src/lib/database/initiation")

		const config = {
			supabase: { url: "https://test.supabase.co", anonKey: "key" },
			admin: { name: "Admin", email: "admin@test.com" },
		}

		const backend1 = getBackend(config)
		const backend2 = getBackend(config)
		expect(backend1).toBe(backend2)
	})

	it("manages cached user state", () => {
		const {
			getCurrentUser,
			setCurrentUser,
		} = require("../../src/lib/database/initiation")

		expect(getCurrentUser()).toBeNull()

		setCurrentUser({ id: "1", email: "test@test.com", name: "Test" })
		expect(getCurrentUser()).toEqual({
			id: "1",
			email: "test@test.com",
			name: "Test",
		})

		setCurrentUser(null)
		expect(getCurrentUser()).toBeNull()
	})

	it("initAuth sets cached user from backend", async () => {
		const {
			default: getBackend,
			initAuth,
			getCurrentUser,
		} = require("../../src/lib/database/initiation")

		const config = {
			supabase: { url: "https://test.supabase.co", anonKey: "key" },
			admin: { name: "Admin", email: "admin@test.com" },
		}

		const backend = getBackend(config)
		const user = await initAuth(backend)

		expect(user).toEqual({
			id: "1",
			email: "admin@test.com",
			name: "Admin",
		})
		expect(getCurrentUser()).toEqual(user)
	})
})
