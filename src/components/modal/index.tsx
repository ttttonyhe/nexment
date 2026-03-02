import React from "react"
import ReplyList from "../sections/ReplyList"
import NexmentDialog from "./Dialog"
import { CommentItem } from "../../lib/database/getCommentsList"
import "../../styles/modal.scss"

const Modal = (Props: {
	type: string
	content?: CommentItem[]
	replyTo?: string
	pageKey?: string
	replyToID?: number
	replyToOID?: string
	replyToName?: string
	visibilityFunction?: (oid: string) => void
	replyItem?: CommentItem
}) => {
	const [repliesModalStatus, setRepliesModalStatus] = React.useState(true)

	const handleClose = () => {
		setRepliesModalStatus(false)
		if (Props.visibilityFunction && Props.replyToOID) {
			Props.visibilityFunction(Props.replyToOID)
		}
	}

	return (
		<NexmentDialog
			open={repliesModalStatus}
			onClose={handleClose}
			animation="slideUp"
			className="nexment-modal-replies"
		>
			<ReplyList
				dataContent={Props.content || []}
				replyTo={Props.replyTo}
				pageKey={Props.pageKey || ""}
				replyToID={Props.replyToID}
				replyToOID={Props.replyToOID}
				replyToName={Props.replyToName}
				replyItem={Props.replyItem!}
			/>
		</NexmentDialog>
	)
}

export default Modal
