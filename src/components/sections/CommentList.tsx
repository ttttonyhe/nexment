import { useState, useContext, useCallback } from "react"
import useComments, { CommentItem } from "../../lib/database/getCommentsList"
import Modal from "../modal"
import CommentsArea from "./CommentArea"
import CommentItemCard from "./CommentItemCard"
import CommentSkeleton from "./Skeleton"
import Icon from "../icon"
import translate from "../../lib/translation"
import Context, { NexmentConfig } from "../../lib/utils/configContext"
import { scrollToElementById } from "../../lib/utils/scrollToElement"
import { useReplyTarget } from "../../lib/hooks/useReplyTarget"

import "../../styles/commentslist.scss"

const CommentsList = (Props: { type: string; pageKey: string }) => {
	const NexmentConfigs: NexmentConfig = useContext(Context)
	const Translation = translate.use().text

	const { commentsData, isLoading, isError } = useComments(
		Props.pageKey,
		NexmentConfigs
	)

	const [loadingStatus, setLoadingStatus] = useState(false)
	const [modalVisibility, setModalVisibility] = useState<
		Record<string, boolean>
	>({})
	const { target: replyTarget, random, setReply } = useReplyTarget()

	const toggleModal = useCallback((oid: string) => {
		setModalVisibility((prev) => ({ ...prev, [oid]: !prev[oid] }))
	}, [])

	const handleReply = useCallback(
		(id: number, oid: string, name: string, content: string) => {
			setReply(id, oid, name, content)
			scrollToElementById("nexment-comment-area")
		},
		[setReply]
	)

	const handleViewReplies = useCallback(
		(oid: string) => toggleModal(oid),
		[toggleModal]
	)

	if (isLoading) return <CommentSkeleton variant="full" />

	if (isError) {
		return (
			<div className="nexment-empty">
				<div>
					<Icon name="commentsError" />
				</div>
				<p>{Translation.serviceError}</p>
				<div className="nexment-error">
					<p>{Translation.problemShooting}</p>
					<p>
						{Translation.problemDes}&nbsp;|&nbsp;
						<a
							href="https://nexment.ouorz.com"
							target="_blank"
							rel="noreferrer"
						>
							{Translation.documentation}
						</a>
					</p>
				</div>
			</div>
		)
	}

	const innerReplyList = (item: CommentItem, depth: number = 1) => (
		<ul
			className="nexment-comments-reply-list nexment-inner-reply-list"
			style={{ borderLeftWidth: `${2 + depth}px` }}
		>
			{item.replyList.map((replyItem) => (
				<div
					className="nexment-comments-list-item-div nexment-comments-list-item-div-inner"
					key={replyItem.ID}
					id={replyItem.ID.toString()}
				>
					<li className="nexment-comments-list-item">
						<CommentItemCard
							item={replyItem}
							config={NexmentConfigs}
							variant="innerReply"
							onReply={handleReply}
						/>
						{replyItem.hasReplies ? innerReplyList(replyItem, depth + 1) : null}
					</li>
				</div>
			))}
		</ul>
	)

	return (
		<div>
			<CommentsArea
				pageKey={Props.pageKey}
				replyTo={replyTarget?.id}
				replyToOID={replyTarget?.oid}
				replyToName={replyTarget?.name}
				replyToContent={replyTarget?.content}
				primaryReplyTo={undefined}
				primaryReplyToOID={undefined}
				primaryReplyToName={undefined}
				random={random}
				reloadFunc={setLoadingStatus}
			/>
			<div className="nexment-header">
				<div>
					<h1>
						{commentsData ? commentsData.length : 0} {Translation.comments}
					</h1>
				</div>
				<div>
					<p className="nexment-header-logo">
						{Translation.poweredBy}{" "}
						<a
							href="https://github.com/ttttonyhe/nexment"
							target="_blank"
							rel="noreferrer"
						>
							<img
								src="https://static.ouorz.com/nexment-logo-with-text.webp"
								alt="nexment comment system"
							/>
						</a>
					</p>
				</div>
			</div>
			<ul className="nexment-comments-list">
				{loadingStatus && <CommentSkeleton variant="compact" />}
			</ul>
			<ul className="nexment-comments-list">
				{commentsData?.length ? (
					commentsData.map((item) => (
						<li
							className="nexment-comments-list-item"
							key={item.ID}
							id={item.ID.toString()}
						>
							<CommentItemCard
								item={item}
								config={NexmentConfigs}
								variant="primary"
								onReply={handleReply}
							/>
							<div>
								<ul className="nexment-comments-reply-list">
									{item.replyList.map((replyItem) => (
										<div
											className="nexment-comments-list-item-div"
											key={replyItem.ID}
											id={replyItem.ID.toString()}
										>
											<li className="nexment-comments-list-item">
												<CommentItemCard
													item={replyItem}
													config={NexmentConfigs}
													variant="reply"
													onReply={handleReply}
													onViewReplies={handleViewReplies}
												/>
												{!NexmentConfigs.features?.replyListModal &&
													replyItem.hasReplies &&
													innerReplyList(replyItem)}
											</li>
											{NexmentConfigs.features?.replyListModal &&
												replyItem.hasReplies &&
												modalVisibility[replyItem.OID] && (
													<Modal
														key={replyItem.OID}
														type="repliesList"
														content={replyItem.replyList}
														replyTo={replyItem.name}
														replyToID={replyItem.ID}
														replyToOID={replyItem.OID}
														replyToName={replyItem.name}
														pageKey={Props.pageKey}
														visibilityFunction={toggleModal}
														replyItem={replyItem}
													/>
												)}
										</div>
									))}
								</ul>
							</div>
						</li>
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
	)
}

export default CommentsList
