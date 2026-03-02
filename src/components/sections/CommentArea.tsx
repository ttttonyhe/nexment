import React from "react"
import { validate } from "email-validator"
import TextareaAutosize from "react-textarea-autosize"
import saveComment from "../../lib/database/saveComment"
import generateCommentID from "../../lib/utils/generateCommentID"
import { refetchData } from "../../lib/database/getCommentsList"
import EmojiPopover from "../controls/emoji-popover"
import TagPopover from "../controls/tag-popover"
import VerificationModal from "../modal/verification"
import getBackend from "../../lib/database/initiation"
import {
	getCurrentUser,
	setCurrentUser,
	initAuth,
} from "../../lib/database/initiation"
import Icon from "../icon"
import translate from "../../lib/translation"
import Context, { NexmentConfig } from "../../lib/utils/configContext"
import { renderMarkdown } from "../../lib/utils/showDown"
import { getGravatarUrl } from "../../lib/utils/gravatar"
import { scrollToElementById } from "../../lib/utils/scrollToElement"

import "../../styles/commentarea.scss"

interface CommentsAreaProps {
	pageKey: string
	replyTo: number | undefined
	replyToOID: string | undefined
	replyToName: string | undefined
	replyToContent: string | undefined
	primaryReplyTo: number | undefined
	primaryReplyToOID: string | undefined
	primaryReplyToName: string | undefined
	random?: number
	reloadFunc?: (loading: boolean) => void
}

const setCommenterInfo = (info: {
	name: string
	email: string
	tag: string
	link?: string
	ewr?: boolean
}) => {
	localStorage.setItem("nexment-commenterInfo", JSON.stringify(info))
}

const CommentsArea = (Props: CommentsAreaProps) => {
	const NexmentConfigs: NexmentConfig = React.useContext(Context)
	const Translation = translate.use().text

	const backend = getBackend(NexmentConfigs)

	const [adminUser, setAdminUser] = React.useState(getCurrentUser())

	React.useEffect(() => {
		initAuth(backend).then((user) => {
			setAdminUser(user)
			setCurrentUser(user)
			if (user) {
				setCommentName(user.name || "")
				setCommentEmail(user.email || "")
			}
		})
	}, [])

	const primaryReplyTo = Props.primaryReplyTo
	const primaryReplyToOID = Props.primaryReplyToOID
	const primaryReplyToName = Props.primaryReplyToName

	const [commentName, setCommentName] = React.useState<string>(
		getCurrentUser()?.name || ""
	)
	const [commentEmail, setCommentEmail] = React.useState<string>(
		getCurrentUser()?.email || ""
	)
	const [commentLink, setCommentLink] = React.useState("")
	const [commentContent, setCommentContent] = React.useState("")
	const [commentTag, setCommentTag] = React.useState("")
	const [commentEwr, setCommentEwr] = React.useState(false)
	const [resetStatus, setResetStatus] = React.useState(false)
	const [modalStatus, setModalStatus] = React.useState(false)
	const [previewStatus, setPreviewStatus] = React.useState(false)
	const [sendingComment, setSendingComment] = React.useState(false)
	const [showProgressBar, setShowProgressBar] = React.useState(false)
	const [progress, setProgress] = React.useState(10)

	React.useEffect(() => {
		if (!modalStatus) {
			const user = getCurrentUser()
			if (user) {
				setAdminUser(user)
				setCommentName(user.name || "")
				setCommentEmail(user.email || "")
			}
		}
	}, [modalStatus])

	React.useEffect(() => {
		if (!showProgressBar) return
		let currentProgress = 10
		const increment = setInterval(() => {
			currentProgress += 10 + Math.floor(currentProgress / 10)
			setProgress(currentProgress + 10)
			if (currentProgress > 60) {
				clearInterval(increment)
			}
		}, 150)
		return () => clearInterval(increment)
	}, [showProgressBar])

	React.useEffect(() => {
		const info = JSON.parse(
			localStorage.getItem("nexment-commenterInfo") || "{}"
		)
		if (info.name) setCommentName(info.name)
		if (info.email) setCommentEmail(info.email)
		if (info.link) setCommentLink(info.link)
		if (info.tag) setCommentTag(info.tag)
		if (info.ewr) setCommentEwr(info.ewr)
	}, [])

	React.useEffect(() => {
		setResetStatus(false)
	}, [Props.replyTo, Props.random])

	React.useEffect(() => {
		resetReplyTo()
	}, [Props.pageKey])

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommentName(e.target.value)
		if (e.target.value === NexmentConfigs.admin.name && !adminUser) {
			setModalStatus(true)
		}
	}

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommentEmail(e.target.value)
		if (e.target.value === NexmentConfigs.admin.email && !adminUser) {
			setModalStatus(true)
		}
	}

	const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommentLink(e.target.value)
	}

	const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setCommentContent(e.target.value)
	}

	const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommentTag(e.target.value)
	}

	const sendCommentHandler = async () => {
		setSendingComment(true)

		const replyingTo = resetStatus ? primaryReplyTo : Props.replyTo
		const replyingToOID = resetStatus ? primaryReplyToOID : Props.replyToOID
		const thisID = generateCommentID()
		const returnData = await saveComment(
			{
				ID: thisID,
				identifier: Props.pageKey,
				name: commentName,
				email: commentEmail,
				link: commentLink || undefined,
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
						await refetchData(Props.pageKey).finally(() => {
							setCommentContent("")
							if (replyingTo) {
								scrollToElementById(replyingTo.toString())
							} else {
								scrollToElementById(thisID.toString())
							}
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

	const resetReplyTo = () => setResetStatus(true)

	const getReplyTo = () =>
		resetStatus ? primaryReplyToName : Props.replyToName

	const getReplyDisplay = () => {
		if (resetStatus) {
			return primaryReplyToName ? "nexment-replying" : ""
		}
		return primaryReplyToName || Props.replyToName ? "nexment-replying" : ""
	}

	const nexmentTextarea = React.useRef<HTMLTextAreaElement>(null)

	const handleAddon = (content: string) => {
		const el = nexmentTextarea.current
		if (!el) return
		const start = el.selectionStart
		const end = el.selectionEnd
		el.setRangeText(content, start, end, "end")
		el.dispatchEvent(new Event("input", { bubbles: true }))
		setCommentContent(el.value)
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
								__html: renderMarkdown(Props.replyToContent),
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
					sendCommentHandler()
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
								src={getGravatarUrl(commentEmail)}
								title={Translation.avatar}
							/>
						</a>
					) : null}
					<input
						className="nexment-comment-area-top-name-input"
						placeholder={commentName || Translation.name}
						onChange={handleNameChange}
						value={commentName}
						type="text"
						required
					/>
					<input
						placeholder={commentEmail || Translation.email}
						onChange={handleEmailChange}
						value={commentEmail}
						type="email"
						required
					/>
					{NexmentConfigs.features?.linkInput ? (
						<input
							placeholder={commentLink || Translation.link}
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
							style={{ width: `${progress}%` }}
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
							className={`nexment-md-preview markdown-body ${previewStatus ? "nexment-previewing" : ""}`}
							dangerouslySetInnerHTML={{
								__html: renderMarkdown(commentContent || Translation.nothing),
							}}
						/>
					) : null}
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
								title={commentEwr ? Translation.unSub : Translation.sub}
								onClick={() => setCommentEwr(!commentEwr)}
							>
								{commentEwr ? <Icon name="email" /> : <Icon name="emailFill" />}
							</button>
						)}
						<button
							type="button"
							title={
								previewStatus ? Translation.stopPreview : Translation.mdPreview
							}
							onClick={() => setPreviewStatus(!previewStatus)}
						>
							{previewStatus ? (
								<Icon name="markdownFill" />
							) : (
								<Icon name="markdown" />
							)}
						</button>
						{adminUser ? (
							<button
								type="button"
								title={Translation.adminLogout}
								onClick={async () => {
									await backend.signOut()
									setCurrentUser(null)
									setAdminUser(null)
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
								<span className="nexment-spinner">
									<Icon name="loader" />
								</span>
							) : (
								<Icon name="arrowRight" />
							)}
						</button>
					</div>
				</div>
				{modalStatus && (
					<VerificationModal
						config={NexmentConfigs}
						visibilityFunction={setModalStatus}
					/>
				)}
			</form>
		</div>
	)
}

export default CommentsArea
