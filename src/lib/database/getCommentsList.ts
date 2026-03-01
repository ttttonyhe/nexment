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

		items.map((item: any) => {
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
		})

		items.map((item: any) => {
			if (
				(item.reply === null && typeof queryKey === "string") ||
				typeof queryKey === "number"
			) {
				const populateReplyList = (
					replyItems?: CommentReplyItem[]
				): CommentItem[] => {
					const populatedReplyItems: CommentReplyItem[] = replyItems || []

					populatedReplyItems.map((item) => {
						if (item.hasReplies) {
							Object.assign(item, {
								replyList: populateReplyList(
									commentItemReplyItems[item.ID.toString()]
								),
							})
						}
					})

					return (populatedReplyItems as CommentItem[]).reverse()
				}

				let replyItemsList: CommentItem[] = []
				if (item.has_replies) {
					replyItemsList = populateReplyList(
						commentItemReplyItems[item.comment_id.toString()]
					)
				}

				const itemData: CommentItem = {
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
				}

				commentItems.push(itemData)
			}
		})

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
