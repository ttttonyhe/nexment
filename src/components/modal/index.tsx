import React from "react"
import ReplyList from "../sections/ReplyList"
import Rodal from "rodal"
import "../../styles/modal.scss"

/**
 * Modal component
 * comments higher than level 2 will be displayed in modals
 *
 * @param {{
 *   type: string;
 *   content?: any;
 *   replyTo?: string;
 *   pageKey?: string;
 *   replyToID?: number;
 *   replyToOID?: string;
 *   replyToName?: string;
 *   visibilityFunction?: Function;
 *   replyItem?: any;
 * }} Props
 * @returns
 */
const Modal = (Props: {
	type: string
	content?: any
	replyTo?: string
	pageKey?: string
	replyToID?: number
	replyToOID?: string
	replyToName?: string
	visibilityFunction?: Function
	replyItem?: any
}) => {
	// Modal state
	const [repliesModalStatus, setRepliesModalStatus] =
		React.useState<boolean>(true)

	// Modal closing event handler
	const handleClose = () => {
		setRepliesModalStatus(!repliesModalStatus)
		if (Props.visibilityFunction) {
			// Change visibility state in CommentsList
			Props.visibilityFunction(Props.replyToOID)
		}
	}
	return (
		<Rodal
			visible={repliesModalStatus}
			onClose={() => {
				handleClose()
			}}
			animation="slideUp"
			duration={200}
			className="nexment-modal-replies"
		>
			<ReplyList
				dataContent={Props.content}
				replyTo={Props.replyTo}
				pageKey={Props.pageKey ? Props.pageKey : ""}
				replyToID={Props.replyToID}
				replyToOID={Props.replyToOID}
				replyToName={Props.replyToName}
				replyItem={Props.replyItem}
			/>
		</Rodal>
	)
}

export default Modal
