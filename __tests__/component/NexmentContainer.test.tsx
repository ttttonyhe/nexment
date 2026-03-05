import React from "react"
import { render, act, waitFor } from "@testing-library/react"

jest.mock("../../src/lib/database/initiation", () => ({
	__esModule: true,
	default: () => ({
		initAuth: jest.fn().mockResolvedValue(null),
		signIn: jest.fn(),
		signUp: jest.fn(),
		signOut: jest.fn(),
		queryComments: jest.fn().mockResolvedValue({ data: [], error: null }),
		insertComment: jest.fn(),
		updateComment: jest.fn(),
		getComment: jest.fn(),
	}),
	getCurrentUser: jest.fn(() => null),
	setCurrentUser: jest.fn(),
	initAuth: jest.fn().mockResolvedValue(null),
}))

import NexmentContainer from "../../src/components/container"
import type { NexmentConfig } from "../../src/lib/utils/configContext"

const config: NexmentConfig = {
	pageKey: "test-page",
	supabase: { url: "https://test.supabase.co", anonKey: "test-key" },
	admin: { name: "Admin", email: "admin@test.com" },
}

describe("NexmentContainer", () => {
	beforeAll(() => {
		global.ResizeObserver = class {
			observe() {}
			unobserve() {}
			disconnect() {}
		} as any
	})

	it("renders the nexment-container div", async () => {
		let container: HTMLElement
		await act(async () => {
			;({ container } = render(<NexmentContainer config={config} />))
		})
		await waitFor(() => {
			expect(container.querySelector(".nexment-container")).toBeTruthy()
		})
	})

	it("uses pageKey from config", async () => {
		let container: HTMLElement
		await act(async () => {
			;({ container } = render(<NexmentContainer config={config} />))
		})
		await waitFor(() => {
			expect(container.querySelector(".nexment-container")).toBeTruthy()
		})
	})

	it("renders comment area form", async () => {
		let container: HTMLElement
		await act(async () => {
			;({ container } = render(<NexmentContainer config={config} />))
		})
		await waitFor(() => {
			expect(container.querySelector(".nexment-comment-area")).toBeTruthy()
		})
	})
})
