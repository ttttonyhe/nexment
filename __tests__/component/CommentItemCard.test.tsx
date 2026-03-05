import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import CommentItemCard from "../../src/components/sections/CommentItemCard"
import type { CommentItem } from "../../src/lib/database/getCommentsList"
import type { NexmentConfig } from "../../src/lib/utils/configContext"

const mockItem: CommentItem = {
	OID: "uuid-1",
	ID: 12345,
	identifier: "/test",
	name: "Test User",
	content: "Hello **world**",
	date: new Date("2024-01-01"),
	email: "test@example.com",
	tag: "Developer",
	replyList: [],
	hasReplies: false,
	link: "https://example.com",
}

const config: NexmentConfig = {
	supabase: { url: "https://test.supabase.co", anonKey: "key" },
	admin: { name: "Admin", email: "admin@test.com" },
	features: { replyListModal: false },
}

describe("CommentItemCard", () => {
	it("renders the commenter name", () => {
		render(
			<CommentItemCard item={mockItem} config={config} variant="primary" />
		)
		expect(screen.getByText("Test User")).toBeTruthy()
	})

	it("renders the comment content as markdown HTML", () => {
		const { container } = render(
			<CommentItemCard item={mockItem} config={config} variant="primary" />
		)
		const contentDiv = container.querySelector(".nexment-comments-content")
		expect(contentDiv?.innerHTML).toContain("<strong>world</strong>")
	})

	it("renders gravatar avatar", () => {
		const { container } = render(
			<CommentItemCard item={mockItem} config={config} variant="primary" />
		)
		const img = container.querySelector(
			".nexment-comments-avatar img"
		) as HTMLImageElement
		expect(img?.src).toContain("gravatar.loli.net/avatar/")
	})

	it("shows tag for primary variant", () => {
		render(
			<CommentItemCard item={mockItem} config={config} variant="primary" />
		)
		expect(screen.getByText("Developer")).toBeTruthy()
	})

	it("does not show tag for reply variant", () => {
		render(
			<CommentItemCard item={mockItem} config={config} variant="reply" />
		)
		expect(screen.queryByText("Developer")).toBeNull()
	})

	it("shows admin badge for admin user", () => {
		const adminItem = {
			...mockItem,
			name: "Admin",
			email: "admin@test.com",
		}
		const { container } = render(
			<CommentItemCard item={adminItem} config={config} variant="primary" />
		)
		expect(container.querySelector(".nexment-admin-badge")).toBeTruthy()
	})

	it("does not show admin badge for regular user", () => {
		const { container } = render(
			<CommentItemCard item={mockItem} config={config} variant="primary" />
		)
		expect(container.querySelector(".nexment-admin-badge")).toBeNull()
	})

	it("calls onReply when reply button is clicked", () => {
		const onReply = jest.fn()
		render(
			<CommentItemCard
				item={mockItem}
				config={config}
				variant="primary"
				onReply={onReply}
			/>
		)
		const replyButton = screen.getByText("Reply")
		fireEvent.click(replyButton)
		expect(onReply).toHaveBeenCalledWith(
			mockItem.ID,
			mockItem.OID,
			mockItem.name,
			mockItem.content
		)
	})

	it("does not render reply button for innerReply variant", () => {
		render(
			<CommentItemCard item={mockItem} config={config} variant="innerReply" />
		)
		expect(screen.queryByText("Reply")).toBeNull()
	})

	it("renders link icon when item has a link", () => {
		const { container } = render(
			<CommentItemCard item={mockItem} config={config} variant="primary" />
		)
		const linkAnchor = container.querySelector('a[href="https://example.com"]')
		expect(linkAnchor).toBeTruthy()
	})

	it("renders replies count button when variant is reply with replies and modal enabled", () => {
		const itemWithReplies = {
			...mockItem,
			hasReplies: true,
			replyList: [
				{ ...mockItem, ID: 2, OID: "uuid-2" },
				{ ...mockItem, ID: 3, OID: "uuid-3" },
			],
		}
		const modalConfig = {
			...config,
			features: { replyListModal: true },
		}

		const { container } = render(
			<CommentItemCard
				item={itemWithReplies}
				config={modalConfig}
				variant="reply"
			/>
		)
		const replyCountBtn = container.querySelector(".nexment-comments-replyto button")
		expect(replyCountBtn).toBeTruthy()
		expect(replyCountBtn?.textContent).toContain("2")
	})
})
