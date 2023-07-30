import React from "react"
import "../../styles/reply.scss"
import { commentsItemType } from "../../lib/database/getCommentsList"
import CommentsArea from "../../components/sections/CommentsArea"
import Rodal from "rodal"
import "../../styles/modal.scss"
import { format } from "timeago.js"
import md5 from "js-md5"
import Icons from "../icons/index"
import ContentLoader from "react-content-loader"
import translate from "../../lib/translation/index"
import Context, { NexmentConfig } from "../../lib/utils/configContext"
import converter from "../../lib/utils/showDown"
import formatLink from "../../lib/utils/linkFormatter"

/**
 * Nexment Reply list
 *
 * @param {{
 *   dataContent: commentsItemType[];
 *   replyTo?: string;
 *   pageKey: string;
 *   replyToID?: number;
 *   replyToOID?: string;
 *   replyToName?: string;
 *   visibilityFunction?: Function;
 *   replyItem?: any;
 * }} Props
 * @returns
 */
const RepliesList = (Props: {
	dataContent: commentsItemType[]
	replyTo?: string
	pageKey: string
	replyToID?: number
	replyToOID?: string
	replyToName?: string
	visibilityFunction?: Function
	replyItem?: any
}) => {
	// Configs
	const NexmentConfigs: NexmentConfig = React.useContext(Context)

	// Translation
	const Translation = translate.use().text

	// Modal states
	const [modalVisibility, setModalVisibility] = React.useState<{
		[propsName: string]: boolean
	}>({})

	// Loading state
	const [loadingStatus, setLoadingStatus] = React.useState<boolean>(false)

	// Comment state
	const [replyToID, setReplyToID] = React.useState<number>(
		Props.replyToID ? Props.replyToID : 0
	)
	const [replyToOID, setReplyToOID] = React.useState<string>(
		Props.replyToOID ? Props.replyToOID : ""
	)
	const [replyToName, setReplyToName] = React.useState<string>(
		Props.replyToName ? Props.replyToName : ""
	)
	const [commentsAreaRandom, setRandom] = React.useState<number>(Math.random())

	/**
	 * Modal toggling function
	 *
	 * @param {string} repliesBelongOID
	 */
	const toggleModal = (repliesBelongOID: string) => {
		/**
		 * State updating solution
		 * refer to https://blog.csdn.net/vandavidchou/article/details/102618866
		 */
		setModalVisibility((prevState: any) => {
			const nowState = { ...prevState }
			nowState[repliesBelongOID] = nowState[repliesBelongOID] ? false : true
			return nowState
		})
	}

	// Modal closing event handler
	const handleClose = (OID: string) => {
		toggleModal(OID)
	}

	/**
	 * Admin badge display
	 *
	 * @param {string} name
	 * @param {string} email
	 * @returns
	 */
	const adminBadge = (name: string, email: string) => {
		if (
			name === NexmentConfigs.admin.name &&
			email === NexmentConfigs.admin.email
		) {
			return <div className="nexment-admin-badge">{Icons().admin}</div>
		} else {
			return ""
		}
	}

	return (
		<div>
			<div className="nexment-modal-text">
				<h1>{Translation.replyList}</h1>
				<p>@{Props.replyToName}</p>
			</div>
			<div className="nexment-reply-container">
				<CommentsArea
					pageKey={Props.pageKey}
					replyTo={replyToID}
					replyToOID={replyToOID}
					replyToName={replyToName}
					primaryReplyTo={Props.replyToID}
					primaryReplyToOID={Props.replyToOID}
					primaryReplyToName={Props.replyToName}
					random={commentsAreaRandom}
					reloadFunc={setLoadingStatus}
				/>
				<ul className="nexment-comments-list">
					<li
						className="nexment-comments-list-item"
						id={Props.replyItem.ID.toString()}
					>
						<div
							className="nexment-comments-div nexment-reply-primary"
							onClick={() => {
								setReplyToID(Props.replyItem.ID)
								setReplyToOID(Props.replyItem.OID)
								setReplyToName(Props.replyItem.name)
								setRandom(Math.random())
								window.location.href = "#nexment-comment-area"
							}}
						>
							<div className="nexment-comments-avatar">
								<img
									src={
										"https://gravatar.loli.net/avatar/" +
										md5(Props.replyItem.email) +
										"?d=mp"
									}
								/>
								{adminBadge(Props.replyItem.name, Props.replyItem.email)}
							</div>
							<div className="nexment-comments-title">
								<h5>
									<a
										href={formatLink(Props.replyItem.link)}
										target="_blank"
										rel="noreferrer"
									>
										{Props.replyItem.name}
									</a>
									<span> · </span>
									<b>{format(Props.replyItem.date)}</b>
									<em className="nexment-reply-icon">{Icons().reply}</em>
								</h5>
								<p className="nexment-comments-des">{Props.replyItem.tag}</p>
								<div
									className={
										"nexment-comments-content " +
										(Props.replyItem.tag ? "" : "margin-top")
									}
									dangerouslySetInnerHTML={{
										__html: converter.makeHtml(Props.replyItem.content),
									}}
								/>
							</div>
						</div>
						<div>
							<ul className="nexment-comments-reply-list">
								{loadingStatus ? (
									<div className="nexment-loading">
										<ContentLoader
											speed={2}
											width={100}
											style={{ width: "100%" }}
											height={45}
											backgroundColor="#f3f3f3"
											foregroundColor="#ecebeb"
										>
											<rect
												x="52"
												y="8"
												rx="3"
												ry="3"
												width="100%"
												height="10"
											/>
											<rect
												x="52"
												y="30"
												rx="3"
												ry="3"
												width="80%"
												height="10"
											/>
											<circle cx="20" cy="24" r="20" />
										</ContentLoader>
									</div>
								) : (
									""
								)}
								{Props.dataContent !== undefined && Props.dataContent.length ? (
									Props.dataContent.map((item) => (
										<div
											className="nexment-comments-list-item-div"
											key={item.ID}
											id={item.ID.toString()}
										>
											<li className="nexment-comments-list-item">
												<div
													className="nexment-comments-div"
													onClick={() => {
														if (item.hasReplies) {
															toggleModal(item.OID)
														} else {
															setReplyToID(item.ID)
															setReplyToOID(item.OID)
															setReplyToName(item.name)
															setRandom(Math.random())
															window.location.href = "#nexment-comment-area"
														}
													}}
												>
													<div className="nexment-comments-avatar">
														<img
															src={
																"https://gravatar.loli.net/avatar/" +
																md5(item.email) +
																"?d=mp"
															}
														/>
														{adminBadge(item.name, item.email)}
													</div>
													<div className="nexment-comments-title">
														<h5>
															<a
																href={formatLink(item.link)}
																target="_blank"
																rel="noreferrer"
															>
																{item.name}
															</a>
															<span> · </span>
															<b>{format(item.date)}</b>
															{item.hasReplies ? (
																<b className="nexment-comments-replyto">
																	<span> · </span>
																	<button>
																		{item.replyList.length}{" "}
																		{item.replyList.length > 1
																			? Translation.replies
																			: Translation.reply}
																		{Icons().down}
																	</button>
																</b>
															) : (
																""
															)}
															<em className="nexment-reply-icon">
																{Icons().reply}
															</em>
														</h5>
														<p className="nexment-comments-des">{item.tag}</p>
														<div
															className={
																"nexment-comments-content " +
																(item.tag ? "" : "margin-top")
															}
															dangerouslySetInnerHTML={{
																__html: converter.makeHtml(item.content),
															}}
														/>
													</div>
												</div>

												{/* Replies */}
												<div>
													{
														// Recursive reply modal
														item.hasReplies && modalVisibility[item.OID] ? (
															<Rodal
																visible={modalVisibility[item.OID]}
																onClose={() => {
																	handleClose(item.OID)
																}}
																duration={0}
																showMask={false}
															>
																<RepliesList
																	key={item.OID}
																	dataContent={item.replyList}
																	replyTo={item.name}
																	pageKey={Props.pageKey}
																	replyToID={item.ID}
																	replyToOID={item.OID}
																	replyToName={item.name}
																	replyItem={item}
																/>
															</Rodal>
														) : (
															""
														)
													}
												</div>
											</li>
										</div>
									))
								) : (
									<div className="nexment-empty">
										<div>{Icons().comments}</div>
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
