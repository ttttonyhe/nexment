import getSupabase from "./initiation"
import { NexmentConfig } from "../utils/configContext"
import useSWR, { mutate } from "swr"

export interface CommentItem {
	OID: string
	ID: number
	identifier: string
	name: string
	content: string
	date: Date
	email: string
	tag: string
	replyList: CommentItem[]
	hasReplies: boolean
	link: string
}

interface SupabaseCommentRow {
	id: string
	comment_id: number
	identifier: string
	name: string
	content: string
	created_at: string
	email: string
	tag: string
	link: string
	has_replies: boolean
	reply: number | null
	email_when_replied: boolean
}

type CommentReplyItem = Omit<CommentItem, "replyList">

export const refetchData = async (pageKey: string) => {
	await mutate(pageKey)
}

const useComments = (
	pageKey: string,
	config: NexmentConfig
): {
	commentsData: CommentItem[] | undefined
	isLoading: boolean
	isError: string
} => {
	const supabase = getSupabase(config.supabase.url, config.supabase.anonKey)

	const ListGet = async (queryKey: string | number): Promise<CommentItem[]> => {
		const { data: items, error } = await supabase
			.from("nexment_comments")
			.select("*")
			.eq("identifier", queryKey)
			.order("created_at", { ascending: false })

		if (error || !items) {
			throw new Error(error?.message || "Failed to fetch comments")
		}

		let commentItems: CommentItem[] = []
		let commentItemReplyItems: {
			[commentItemId: string]: CommentReplyItem[]
		} = {}

		for (const item of items as SupabaseCommentRow[]) {
			if (item.reply !== null && item.reply !== undefined) {
				const replyToCommentId = item.reply.toString()

				if (commentItemReplyItems[replyToCommentId] === undefined) {
					commentItemReplyItems[replyToCommentId] = []
				}

				commentItemReplyItems[replyToCommentId].push({
					OID: item.id,
					ID: item.comment_id,
					identifier: item.identifier,
					name: item.name,
					content: item.content,
					date: new Date(item.created_at),
					email: item.email,
					tag: item.tag,
					link: item.link,
					hasReplies: item.has_replies,
				})
			}
		}

		const populateReplyList = (
			replyItems?: CommentReplyItem[]
		): CommentItem[] => {
			if (!replyItems) return []
			return replyItems
				.map((item): CommentItem => ({
					...item,
					replyList: item.hasReplies
						? populateReplyList(
								commentItemReplyItems[item.ID.toString()]
							)
						: [],
				}))
				.reverse()
		}

		for (const item of items as SupabaseCommentRow[]) {
			if (
				(item.reply === null && typeof queryKey === "string") ||
				typeof queryKey === "number"
			) {
				const replyItemsList: CommentItem[] = item.has_replies
					? populateReplyList(
							commentItemReplyItems[item.comment_id.toString()]
						)
					: []

				commentItems.push({
					OID: item.id,
					ID: item.comment_id,
					identifier: item.identifier,
					name: item.name,
					content: item.content,
					date: new Date(item.created_at),
					replyList: replyItemsList,
					email: item.email,
					tag: item.tag,
					link: item.link,
					hasReplies: item.has_replies,
				})
			}
		}

		return commentItems
	}

	const { data, error } = useSWR(pageKey, ListGet)
	return {
		commentsData: data,
		isLoading: !error && !data,
		isError: error,
	}
}

export default useComments
