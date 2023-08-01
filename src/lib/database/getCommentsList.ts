import leanCloud from "./initiation"
import { Queriable } from "leancloud-storage"
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

/**
 * Refetch data using SWR
 *
 * @param {string} pageKey
 */
export const refetchData = async (pageKey: string) => {
	await mutate(pageKey)
}

/**
 * SWR component
 * using AsyncGet as the fetcher
 *
 * @param {string} pageKey
 * @param {NexmentConfig} config
 */
const useComments = (
	pageKey: string,
	config: NexmentConfig
): {
	commentsData: CommentItem[] | undefined
	isLoading: boolean
	isError: string
} => {
	const AV = leanCloud(
		config.leancloud.appId,
		config.leancloud.appKey,
		config.leancloud.serverURL
	)
	/**
	 *  Fetch comments data from the cloud
	 *
	 * @param {string | number} queryKey or replyID
	 * @returns {Promise<CommentItem[]>}
	 */
	const ListGet = async (queryKey: string | number): Promise<CommentItem[]> => {
		const query = new AV.Query("nexment_comments")
		query.equalTo("identifier", queryKey)
		query.descending("createdAt")

		let commentItems: CommentItem[] = []
		let commentItemReplyItems: {
			[commentItemId: string]: CommentReplyItem[]
		} = {}

		return await query.find().then(async (items: Queriable[]) => {
			// Iterate through all comments to determine the replies of each comment
			items.map(async (item) => {
				if (item.get("reply") !== undefined) {
					const replyToCommentId = item.get("reply").toString()

					if (commentItemReplyItems[replyToCommentId] === undefined) {
						commentItemReplyItems[replyToCommentId] = []
					}

					commentItemReplyItems[replyToCommentId].push({
						OID: item.get("objectId"),
						ID: item.get("ID"),
						identifier: item.get("identifier"),
						name: item.get("name"),
						content: item.get("content"),
						date: item.createdAt || new Date(),
						email: item.get("email"),
						tag: item.get("tag"),
						link: item.get("link"),
						hasReplies: item.get("hasReplies"),
					})
				}
			})

			// Construct the comment list structure
			items.map(async (item) => {
				if (
					(item.get("reply") === undefined && typeof queryKey === "string") ||
					typeof queryKey === "number"
				) {
					// Populate reply comments
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

					// Form a list of replies for current comment
					let replyItemsList: CommentItem[] = []
					if (item.get("hasReplies")) {
						replyItemsList = populateReplyList(
							commentItemReplyItems[item.get("ID").toString()]
						)
					}

					const itemData: CommentItem = {
						OID: item.get("objectId"),
						ID: item.get("ID"),
						identifier: item.get("identifier"),
						name: item.get("name"),
						content: item.get("content"),
						date: item.createdAt || new Date(),
						replyList: replyItemsList,
						email: item.get("email"),
						tag: item.get("tag"),
						link: item.get("link"),
						hasReplies: item.get("hasReplies"),
					}

					commentItems.push(itemData)
				}
			})

			return commentItems
		})
	}

	const { data, error } = useSWR(pageKey, ListGet)
	return {
		commentsData: data,
		isLoading: !error && !data,
		isError: error,
	}
}

export default useComments
