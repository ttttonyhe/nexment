import React from "react"
import { md5 } from "js-md5"
import { Tooltip } from "react-tooltip"
import { validate } from "email-validator"
import TextareaAutosize from "react-textarea-autosize"
import insertTextAtCursor from "insert-text-at-cursor"
import usingSaveComment from "../../lib/database/saveComment"
import generateCommentID from "../../lib/utils/generateCommentID"
import { refetchData } from "../../lib/database/getCommentsList"
import EmojiPopover from "../controls/emoji-popover"
import TagPopover from "../controls/tag-popover"
import VerificationModal from "../modal/verification"
import leanCloud from "../../lib/database/initiation"
import Icon from "../icon"
import translate from "../../lib/translation"
import Context, { NexmentConfig } from "../../lib/utils/configContext"
import converter from "../../lib/utils/showDown"
import { scrollToElementById } from "../../lib/utils/scrollToElement"

import "../../styles/commentarea.scss"

// Get commenter info from local storage
const getCommenterInfo = (type: string) => {
	const commenterInfo = JSON.parse(
		localStorage.getItem("nexment-commenterInfo") || "{}"
	)
	if (commenterInfo) {
		return commenterInfo[type]
	} else {
		if (type === "ewr") {
			return false
		} else {
			return ""
		}
	}
}

// Store commenter info in local storage
const setCommenterInfo = (info: {
	name: string
	email: string
	tag: string
	link?: string
	ewr?: boolean
}) => {
	localStorage.setItem("nexment-commenterInfo", JSON.stringify(info))
}

/**
 * Nexment Comment area
 */
const CommentsArea = (Props: {
	pageKey: string
	replyTo: number | undefined
	replyToOID: string | undefined
	replyToName: string | undefined
	replyToContent: string | undefined
	primaryReplyTo: number | undefined
	primaryReplyToOID: string | undefined
	primaryReplyToName: string | undefined
	random?: number
	reloadFunc?: Function
}) => {
	// Configs
	const NexmentConfigs: NexmentConfig = React.useContext(Context)

	// Translation
	const Translation = translate.use().text

	// Initialize leancloud storage
	const AV = leanCloud(
		NexmentConfigs.leancloud.appId,
		NexmentConfigs.leancloud.appKey,
		NexmentConfigs.leancloud.serverURL
	)

	// Get initial replyto / replytoOID
	const primaryReplyTo = Props.primaryReplyTo
	const primaryReplyToOID = Props.primaryReplyToOID
	const primaryReplyToName = Props.primaryReplyToName

	// Current comment states
	const [commentName, setCommentName] = React.useState<string>(
		AV.User.current() ? AV.User.current().attributes.username : ""
	)
	const [commentEmail, setCommentEmail] = React.useState<string>(
		AV.User.current() ? AV.User.current().attributes.email : ""
	)
	const [commentLink, setCommentLink] = React.useState<string>("")
	const [commentContent, setCommentContent] = React.useState<string>("")
	const [commentTag, setCommentTag] = React.useState<string>("")
	const [commentEwr, setCommentEwr] = React.useState<boolean>(false)

	// Resetting state
	const [resetStatus, setResetStatus] = React.useState<boolean>(false)

	// Modal state
	const [modalStatus, setModalStatus] = React.useState<boolean>(false)

	// Markdown preview state
	const [previewStatus, setPreviewStatus] = React.useState<boolean>(false)

	const [sendingComment, setSendingComment] = React.useState<boolean>(false)
	const [showProgressBar, setShowProgressBar] = React.useState<boolean>(false)
	const [progress, setProgress] = React.useState<number>(10)

	React.useEffect(() => {
		if (showProgressBar) {
			let currentProgress = 10
			const increment = setInterval(() => {
				currentProgress += 10 + Math.floor(currentProgress / 10)
				setProgress(currentProgress + 10)
				if (currentProgress > 60) {
					clearInterval(increment)
				}
			}, 150)
		}
	}, [showProgressBar])

	React.useEffect(() => {
		const commenterName = getCommenterInfo("name")
		const commenterEmail = getCommenterInfo("email")
		const commenterLink = getCommenterInfo("link")
		const commenterTag = getCommenterInfo("tag")
		const commenterEwr = getCommenterInfo("ewr")

		if (commenterName) {
			setCommentName(commenterName)
		}
		if (commenterEmail) {
			setCommentEmail(commenterEmail)
		}
		if (commenterLink) {
			setCommentLink(commenterLink)
		}
		if (commenterTag) {
			setCommentTag(commenterTag)
		}
		if (commenterEwr) {
			setCommentEwr(commenterEwr)
		}
	}, [])

	/**
	 * Listen to replyTo / random change
	 * random is a random number
	 * designed to make reset status false when replying to the previous comment
	 */
	React.useEffect(() => {
		setResetStatus(false)
	}, [Props.replyTo, Props.random])

	React.useEffect(() => {
		resetReplyTo()
	}, [Props.pageKey])

	// Input change handlers
	const handleNameChange = (e: {
		target: { value: React.SetStateAction<string> }
	}) => {
		setCommentName(e.target.value)
		if (e.target.value === NexmentConfigs.admin.name && !AV.User.current()) {
			setModalStatus(true)
		}
	}

	const handleEmailChange = (e: {
		target: { value: React.SetStateAction<string> }
	}) => {
		setCommentEmail(e.target.value)
		if (e.target.value === NexmentConfigs.admin.email && !AV.User.current()) {
			setModalStatus(true)
		}
	}

	const handleLinkChange = (e: {
		target: { value: React.SetStateAction<string> }
	}) => {
		setCommentLink(e.target.value)
	}

	const handleContentChange = (e: {
		target: { value: React.SetStateAction<string> }
	}) => {
		setCommentContent(e.target.value)
	}

	const handleTagChange = (e: {
		target: { value: React.SetStateAction<string> }
	}) => {
		setCommentTag(e.target.value)
	}

	// Comment submitting function
	const sendComment = async () => {
		setSendingComment(true)

		let replyingTo = resetStatus ? primaryReplyTo : Props.replyTo
		let replyingToOID = resetStatus ? primaryReplyToOID : Props.replyToOID
		let thisID = generateCommentID().idData
		const returnData = await usingSaveComment(
			{
				ID: thisID,
				identifier: Props.pageKey,
				name: commentName,
				email: commentEmail,
				link: commentLink ? commentLink : undefined,
				content: commentContent,
				tag: commentTag,
				reply: replyingTo,
				replyOID: replyingToOID,
				ewr: commentEwr,
			},
			NexmentConfigs
		)

		switch (returnData.status) {
			case 400:
				alert(
					"Nexment: An error occurred while submitting your comment.\nComment is too long or too short."
				)
				setSendingComment(false)
				break
			case 500:
				alert(
					"Nexment: An error occurred while submitting your comment.\nPlease check if you have entered the correct information."
				)
				setSendingComment(false)
				break
			case 501:
				setModalStatus(true)
				setSendingComment(false)
				break
			case 401:
				alert(
					"Nexment: An error occurred while submitting your comment.\nYour comment has been identified as a spam."
				)
				setSendingComment(false)
				break
			default:
				setShowProgressBar(true)

				// Store commenter info
				setCommenterInfo({
					name: commentName,
					email: commentEmail,
					tag: commentTag,
					link: commentLink,
					ewr: commentEwr,
				})

				setTimeout(() => {
					setProgress(100)

					setTimeout(async () => {
						setShowProgressBar(false)
						setProgress(10)

						// Refetch data using swr mutate
						await refetchData(Props.pageKey).finally(() => {
							// Set content to empty
							setCommentContent("")

							// Jump to replied to/comment item
							if (replyingTo) {
								scrollToElementById(replyingTo.toString())
							} else {
								scrollToElementById(thisID.toString())
							}

							// flash replied to/comment item
							document
								.getElementById(thisID.toString())
								?.classList.add("nexment-flash")
							setTimeout(() => {
								document
									.getElementById(thisID.toString())
									?.classList.remove("nexment-flash")
							}, 2000)

							setSendingComment(false)
							resetReplyTo()
						})
					}, 500)
				}, 1500)
		}
	}

	// Reset reply to initial
	const resetReplyTo = () => {
		setResetStatus(true)
	}

	// Get who are we replying to
	const getReplyTo = () => {
		if (resetStatus) {
			return primaryReplyToName
		} else {
			return Props.replyToName
		}
	}

	// Reply className
	const getReplyDisplay = () => {
		if (resetStatus) {
			if (primaryReplyToName) {
				return "nexment-replying"
			} else {
				return ""
			}
		} else {
			if (primaryReplyToName || Props.replyToName) {
				return "nexment-replying"
			} else {
				return ""
			}
		}
	}

	// Create a ref for textarea
	const nexmentTextarea: any = React.useRef()

	// Process data sending from content addons, insert content at cursor
	const handleAddon = (content: string) => {
		// Insert emoji at cursor
		insertTextAtCursor(nexmentTextarea.current, content)
	}

	return (
		<div className="nexment-comment-area-container">
			{Props.replyToContent &&
			getReplyDisplay() === "nexment-replying" &&
			!resetStatus ? (
				<div className="nexment-comment-area-replying-to">
					<div className="nexment-comment-area-replying-to-info">
						<div className="nexment-comment-area-replying-to-header">
							<Icon name="resetFill" />
							<span>Replying to @{getReplyTo()}:</span>
						</div>
						<div
							className="nexment-comment-area-replying-to-content"
							dangerouslySetInnerHTML={{
								__html: converter.makeHtml(Props.replyToContent),
							}}
						/>
					</div>
					<div
						className="nexment-comment-area-replying-to-cta"
						onClick={resetReplyTo}
					>
						<button>
							<Icon name="cancel" />
						</button>
					</div>
				</div>
			) : null}
			<form
				className="nexment-comment-area"
				id="nexment-comment-area"
				onSubmit={(e) => {
					e.preventDefault()
					sendComment()
				}}
			>
				<div className="nexment-comment-area-top">
					{commentEmail && validate(commentEmail) ? (
						<a
							className="nexment-comment-area-top-name-avatar"
							href="https://cn.gravatar.com/support/what-is-gravatar"
							target="_blank"
							rel="noreferrer"
						>
							<img
								src={`https://gravatar.loli.net/avatar/${md5(
									commentEmail
								)}?d=mp`}
								data-tooltip-content={Translation.avatar}
							/>
						</a>
					) : null}
					<input
						className="nexment-comment-area-top-name-input"
						placeholder={commentName ? commentName : Translation.name}
						onChange={handleNameChange}
						value={commentName}
						type="text"
						required
					/>
					<input
						placeholder={commentEmail ? commentEmail : Translation.email}
						onChange={handleEmailChange}
						value={commentEmail}
						type="email"
						required
					/>
					{NexmentConfigs.features?.linkInput ? (
						<input
							placeholder={commentLink ? commentLink : Translation.link}
							onChange={handleLinkChange}
							value={commentLink}
							type="url"
						/>
					) : null}
				</div>
				<div className="nexment-comment-area-middle">
					{showProgressBar && (
						<div
							className="nexment-comment-area-middle-progress-bar"
							style={{
								width: `${progress}%`,
							}}
						/>
					)}
					<TextareaAutosize
						value={commentContent}
						placeholder={Translation.placeHolder + "..."}
						onChange={handleContentChange}
						ref={nexmentTextarea}
						maxLength={1000}
						disabled={sendingComment}
					/>
					{previewStatus ? (
						<div
							className={`nexment-md-preview markdown-body ${
								previewStatus ? "nexment-previewing" : ""
							}`}
							dangerouslySetInnerHTML={{
								__html: converter.makeHtml(
									commentContent ? commentContent : Translation.nothing
								),
							}}
						/>
					) : (
						""
					)}
				</div>
				<div className="nexment-comment-area-bottom">
					<div className="nexment-comment-area-toolbar">
						<EmojiPopover handler={handleAddon} />
						{NexmentConfigs.features?.descriptionTag && (
							<TagPopover tag={commentTag} handler={handleTagChange} />
						)}
						{NexmentConfigs.features?.replyEmailNotifications && (
							<button
								type="button"
								data-tooltip-id="nexment-tooltip"
								data-tooltip-content={
									commentEwr ? Translation.unSub : Translation.sub
								}
								onClick={() => {
									setCommentEwr(!commentEwr)
								}}
							>
								{commentEwr ? <Icon name="email" /> : <Icon name="emailFill" />}
							</button>
						)}
						<button
							type="button"
							data-tooltip-id="nexment-tooltip"
							data-tooltip-content={
								previewStatus ? Translation.stopPreview : Translation.mdPreview
							}
							onClick={() => {
								setPreviewStatus(!previewStatus)
							}}
						>
							{previewStatus ? (
								<Icon name="markdownFill" />
							) : (
								<Icon name="markdown" />
							)}
						</button>
						{AV.User.current() ? (
							<button
								type="button"
								data-tooltip-id="nexment-tooltip"
								data-tooltip-content={Translation.adminLogout}
								onClick={() => {
									AV.User.logOut()
									window.location.reload()
								}}
							>
								<Icon name="logout" />
							</button>
						) : null}
					</div>
					<div className="nexment-comment-area-submit">
						<button type="submit" disabled={sendingComment}>
							<span>{Translation.submit}</span>
							{sendingComment ? (
								<span className="spinner">
									<Icon name="loader" />
								</span>
							) : (
								<Icon name="arrowRight" />
							)}
						</button>
					</div>
				</div>
				{/* Modals */}
				{modalStatus ? (
					<VerificationModal
						config={NexmentConfigs}
						visibilityFunction={setModalStatus}
					/>
				) : (
					""
				)}
				<Tooltip className="nexment-tooltip" id="nexment-tooltip" />
			</form>
		</div>
	)
}

export default CommentsArea
