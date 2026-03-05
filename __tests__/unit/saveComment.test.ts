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

import saveComment from "../../src/lib/database/saveComment"
import { getCurrentUser } from "../../src/lib/database/initiation"

const baseConfig: NexmentConfig = {
	supabase: { url: "https://test.supabase.co", anonKey: "test-key" },
	admin: { name: "Admin", email: "admin@test.com" },
}

const validComment = {
	identifier: "/page",
	ID: 12345,
	name: "User",
	email: "user@test.com",
	content: "Hello world",
}

describe("saveComment", () => {
	beforeEach(() => {
		jest.clearAllMocks()
		;(getCurrentUser as jest.Mock).mockReturnValue(null)
	})

	it("returns 501 when using admin name without being logged in", async () => {
		const result = await saveComment(
			{ ...validComment, name: "Admin", email: "admin@test.com" },
			baseConfig
		)
		expect(result.status).toBe(501)
	})

	it("returns 400 when content is empty", async () => {
		const result = await saveComment(
			{ ...validComment, content: "   " },
			baseConfig
		)
		expect(result.status).toBe(400)
	})

	it("returns 400 when content exceeds 1000 characters", async () => {
		const result = await saveComment(
			{ ...validComment, content: "a".repeat(1001) },
			baseConfig
		)
		expect(result.status).toBe(400)
	})

	it("returns 401 when email matches blacklist", async () => {
		const config = {
			...baseConfig,
			blackList: [{ email: "spam@test.com" }],
		}
		const result = await saveComment(
			{ ...validComment, email: "spam@test.com" },
			config
		)
		expect(result.status).toBe(401)
	})

	it("returns 401 when name is similar to blacklisted name", async () => {
		const config = {
			...baseConfig,
			blackList: [{ name: "SpamBot" }],
		}
		const result = await saveComment(
			{ ...validComment, name: "SpamBot" },
			config
		)
		expect(result.status).toBe(401)
	})

	it("returns 401 when content contains blacklisted keyword", async () => {
		const config = {
			...baseConfig,
			blackList: [{ keyword: "viagra" }],
		}
		const result = await saveComment(
			{ ...validComment, content: "buy viagra now" },
			config
		)
		expect(result.status).toBe(401)
	})

	it("returns 401 when link is similar to blacklisted link", async () => {
		const config = {
			...baseConfig,
			blackList: [{ link: "https://spam-site.com" }],
		}
		const result = await saveComment(
			{ ...validComment, link: "https://spam-site.com" },
			config
		)
		expect(result.status).toBe(401)
	})

	it("returns 201 and inserts comment on success", async () => {
		const savedComment = { id: "uuid-1", ...validComment }
		mockBackend.insertComment.mockResolvedValue({
			data: savedComment,
			error: null,
		})

		const result = await saveComment(validComment, baseConfig)

		expect(result.status).toBe(201)
		expect(result.savedComment).toEqual(savedComment)
		expect(mockBackend.insertComment).toHaveBeenCalledWith(
			expect.objectContaining({
				identifier: "/page",
				comment_id: 12345,
				name: "User",
				email: "user@test.com",
				content: "Hello world",
			})
		)
	})

	it("returns 500 when insert fails", async () => {
		mockBackend.insertComment.mockResolvedValue({
			data: null,
			error: { message: "DB error" },
		})

		const result = await saveComment(validComment, baseConfig)
		expect(result.status).toBe(500)
	})

	it("handles replies by updating parent and inserting", async () => {
		mockBackend.updateComment.mockResolvedValue({ error: null })
		mockBackend.getComment.mockResolvedValue({
			data: { email_when_replied: false, email: "parent@test.com" },
			error: null,
		})
		mockBackend.insertComment.mockResolvedValue({
			data: { id: "uuid-2" },
			error: null,
		})

		const result = await saveComment(
			{
				...validComment,
				reply: 11111,
				replyOID: "parent-oid",
			},
			baseConfig
		)

		expect(result.status).toBe(201)
		expect(mockBackend.updateComment).toHaveBeenCalledWith("parent-oid", {
			has_replies: true,
		})
	})

	it("returns 500 when email is invalid", async () => {
		const result = await saveComment(
			{ ...validComment, email: "not-an-email" },
			baseConfig
		)
		expect(result.status).toBe(500)
	})

	it("includes tag in the comment when provided", async () => {
		mockBackend.insertComment.mockResolvedValue({
			data: { id: "uuid-3" },
			error: null,
		})

		await saveComment({ ...validComment, tag: "Developer" }, baseConfig)

		expect(mockBackend.insertComment).toHaveBeenCalledWith(
			expect.objectContaining({ tag: "Developer" })
		)
	})

	it("cleans and includes link when provided", async () => {
		mockBackend.insertComment.mockResolvedValue({
			data: { id: "uuid-4" },
			error: null,
		})

		await saveComment({ ...validComment, link: "example.com" }, baseConfig)

		expect(mockBackend.insertComment).toHaveBeenCalledWith(
			expect.objectContaining({ link: "https://example.com" })
		)
	})
})
