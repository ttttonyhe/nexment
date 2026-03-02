import React, { useCallback, useMemo } from "react"
import { CommentItem } from "../../lib/database/getCommentsList"
import CommentsArea from "./CommentArea"
import CommentItemCard from "./CommentItemCard"
import CommentSkeleton from "./Skeleton"
import Icon from "../icon"
import translate from "../../lib/translation"
import Context, { NexmentConfig } from "../../lib/utils/configContext"
import { useReplyTarget } from "../../lib/hooks/useReplyTarget"
import "../../styles/modal.scss"

interface FlatReply {
	item: CommentItem
	depth: number
}

const flattenReplies = (
	items: CommentItem[],
	depth: number = 0
): FlatReply[] => {
	const result: FlatReply[] = []
	for (const item of items) {
		result.push({ item, depth })
		if (item.replyList.length > 0) {
			result.push(...flattenReplies(item.replyList, depth + 1))
		}
	}
	return result
}

const RepliesList = (Props: {
	dataContent: CommentItem[]
	replyTo?: string
	pageKey: string
	replyToID?: number
	replyToOID?: string
	replyToName?: string
	visibilityFunction?: (oid: string) => void
	replyItem: CommentItem
}) => {
	const NexmentConfigs: NexmentConfig = React.useContext(Context)
	const Translation = translate.use().text

	const [loadingStatus, setLoadingStatus] = React.useState(false)

	const {
		target: replyTarget,
		random,
		setReply,
	} = useReplyTarget(
		Props.replyToID && Props.replyToOID && Props.replyToName
			? {
					id: Props.replyToID,
					oid: Props.replyToOID,
					name: Props.replyToName,
					content: "",
				}
			: null
	)

	const flatReplies = useMemo(
		() => flattenReplies(Props.dataContent),
		[Props.dataContent]
	)

	const handleItemReply = useCallback(
		(id: number, oid: string, name: string, content: string) => {
			setReply(id, oid, name, content)
			window.location.href = "#nexment-comment-area"
		},
		[setReply]
	)

	const handlePrimaryClick = useCallback(() => {
		setReply(Props.replyItem.ID, Props.replyItem.OID, Props.replyItem.name, "")
		window.location.href = "#nexment-comment-area"
	}, [Props.replyItem, setReply])

	return (
		<div>
			<div className="nexment-modal-text">
				<h1>{Translation.replyList}</h1>
				<p>@{Props.replyToName}</p>
			</div>
			<div className="nexment-reply-container">
				<CommentsArea
					pageKey={Props.pageKey}
					replyTo={replyTarget?.id}
					replyToOID={replyTarget?.oid}
					replyToName={replyTarget?.name}
					replyToContent={replyTarget?.content}
					primaryReplyTo={Props.replyToID}
					primaryReplyToOID={Props.replyToOID}
					primaryReplyToName={Props.replyToName}
					random={random}
					reloadFunc={setLoadingStatus}
				/>
				<ul className="nexment-comments-list">
					<li
						className="nexment-comments-list-item"
						id={Props.replyItem.ID.toString()}
					>
						<div onClick={handlePrimaryClick}>
							<CommentItemCard
								item={Props.replyItem}
								config={NexmentConfigs}
								variant="modalPrimary"
							/>
						</div>
						<div>
							<ul className="nexment-comments-reply-list">
								{loadingStatus && <CommentSkeleton variant="compact" />}
								{flatReplies.length ? (
									flatReplies.map(({ item, depth }) => (
										<div
											className="nexment-comments-list-item-div"
											key={item.ID}
											id={item.ID.toString()}
											style={
												depth > 0
													? {
															borderLeft: `${2 + depth}px dashed #eee`,
															paddingLeft: 10,
															marginLeft: 5,
														}
													: undefined
											}
										>
											<li className="nexment-comments-list-item">
												<CommentItemCard
													item={item}
													config={NexmentConfigs}
													variant="modal"
													onReply={handleItemReply}
												/>
											</li>
										</div>
									))
								) : (
									<div className="nexment-empty">
										<div>
											<Icon name="comments" />
										</div>
										<p>{Translation.noComments}</p>
									</div>
								)}
							</ul>
						</div>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default RepliesList
