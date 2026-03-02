import React from "react"
import { format } from "timeago.js"
import { CommentItem } from "../../lib/database/getCommentsList"
import { getGravatarUrl } from "../../lib/utils/gravatar"
import { renderMarkdown } from "../../lib/utils/showDown"
import formatLink from "../../lib/utils/linkFormatter"
import Icon from "../icon"
import { NexmentConfig } from "../../lib/utils/configContext"
import translate from "../../lib/translation"

interface CommentItemCardProps {
	item: CommentItem
	config: NexmentConfig
	variant: "primary" | "reply" | "innerReply" | "modal" | "modalPrimary"
	onReply?: (id: number, oid: string, name: string, content: string) => void
	onViewReplies?: (oid: string) => void
}

const AdminBadge = React.memo(
	({ name, email, config }: { name: string; email: string; config: NexmentConfig }) => {
		if (name === config.admin.name && email === config.admin.email) {
			return (
				<div className="nexment-admin-badge">
					<Icon name="admin" />
				</div>
			)
		}
		return null
	}
)

const CommentItemCard = React.memo(
	({ item, config, variant, onReply, onViewReplies }: CommentItemCardProps) => {
		const Translation = translate.use().text

		const showTag = variant === "primary" || variant === "modalPrimary" || variant === "modal"
		const showViewReplies =
			variant === "reply" &&
			item.hasReplies &&
			config.features?.replyListModal
		const isInnerReply = variant === "innerReply"
		const isModalItem = variant === "modal" || variant === "modalPrimary"

		const contentClassName =
			variant === "reply" || variant === "innerReply"
				? "nexment-comments-content nexment-margin-top-reply"
				: `nexment-comments-content ${item.tag ? "" : "nexment-margin-top"}`

		const handleReplyClick = () => {
			if (variant === "reply" && item.hasReplies && config.features?.replyListModal) {
				onViewReplies?.(item.OID)
			} else {
				onReply?.(item.ID, item.OID, item.name, item.content)
			}
		}

		return (
			<div
				className={`nexment-comments-div${
					item.hasReplies ? " nexment-comments-div-with-replies" : ""
				}${variant === "modalPrimary" ? " nexment-reply-primary" : ""}`}
				onClick={isModalItem ? handleReplyClick : undefined}
			>
				<div className="nexment-comments-avatar">
					<img src={getGravatarUrl(item.email)} />
					<AdminBadge name={item.name} email={item.email} config={config} />
				</div>
				<div className="nexment-comments-title">
					<h5>
						{isModalItem ? (
							<a
								href={item.link ? formatLink(item.link) : undefined}
								target="_blank"
								rel="noreferrer"
							>
								{item.name}
							</a>
						) : (
							<>
								{item.name}
								{item.link ? (
									<>
										<span> · </span>
										<a
											href={formatLink(item.link)}
											target="_blank"
											rel="noreferrer"
										>
											<Icon name="link" />
										</a>
									</>
								) : null}
							</>
						)}
						<span> · </span>
						<b>{format(item.date)}</b>
						{showViewReplies && (
							<b className="nexment-comments-replyto">
								<span> · </span>
								<button onClick={() => onViewReplies?.(item.OID)}>
									{item.replyList.length}{" "}
									{item.replyList.length > 1
										? Translation.replies
										: Translation.reply}
									<Icon name="down" />
								</button>
							</b>
						)}
						{isModalItem ? (
							<em className="nexment-reply-icon">
								<Icon name="reply" />
							</em>
						) : !isInnerReply ? (
							<button
								className={
									variant === "primary"
										? "nexment-reply-icon"
										: "nexment-reply-icon-reply"
								}
								onClick={handleReplyClick}
							>
								<Icon name="reply" /> Reply
							</button>
						) : null}
					</h5>
					{showTag && item.tag && (
						<p className="nexment-comments-des">{item.tag}</p>
					)}
					<div
						className={contentClassName}
						dangerouslySetInnerHTML={{
							__html: renderMarkdown(item.content),
						}}
					/>
				</div>
			</div>
		)
	}
)

export default CommentItemCard
