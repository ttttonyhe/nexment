import * as EmailValidator from "email-validator"
import similarity from "string-similarity"
import leanCloud from "./initiation"
import converter from "../utils/showDown"
import { NexmentConfig } from "../utils/configContext"

interface NewCommentItem {
	identifier: string
	ID: number
	name: string
	email: string
	content: any
	tag?: string
	reply?: number | undefined
	replyOID?: string
	ewr?: boolean
	link?: string
}

/**
 * Send email when receiving a reply
 *
 * @param {string} email
 * @param {string} url
 * @param {string} content
 */
const sendEmail = async (
	fromName: string,
	toEmail: string,
	content: string,
	url: string
) => {
	await fetch("https://nexment-mailer.lune.one", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			fromName,
			toEmail,
			content,
			url,
		}),
	})
}

/**
 * Make sure the link is valid
 *
 * @param {string} link
 */
const cleanLink = (link: string) => {
	const finalLink = link.replace(/\s*/g, "")
	if (finalLink.startsWith("http://") || finalLink.startsWith("https://")) {
		return link
	} else {
		return "https://" + finalLink
	}
}

/**
 * Submit comment to LeanCloud
 *
 * @param {NewCommentItem} info
 * @param {NexmentConfig} config
 */
const useSavingComment = async (
	info: NewCommentItem,
	config: NexmentConfig
): Promise<{ status: number; savedComment?: any }> => {
	// initialize leancloud storage
	const AV = leanCloud(
		config.leancloud.appId,
		config.leancloud.appKey,
		config.leancloud.serverURL
	)

	// If commenting as admin, then user must be logged in
	if (
		(info.email === config.admin.email || info.name === config.admin.name) &&
		!AV.User.current()
	) {
		return {
			status: 501,
		}
	}

	// check if all info has been provided
	if (
		info.identifier &&
		info.ID &&
		info.name &&
		info.email &&
		EmailValidator.validate(info.email) &&
		info.content
	) {
		// go through the blacklist to check if the comment is spam
		let i = 0
		while (config.blackList && config.blackList[i]) {
			const rule = config.blackList[i]
			if (rule.email && info.email == rule.email) {
				return {
					status: 401,
				}
			}
			if (
				rule.name &&
				similarity.compareTwoStrings(info.name, rule.name) > 0.6
			) {
				return {
					status: 401,
				}
			}
			if (rule.keyword && info.content.indexOf(rule.keyword) !== -1) {
				return {
					status: 401,
				}
			}
			if (
				rule.link &&
				info.link &&
				similarity.compareTwoStrings(info.link, rule.link) > 0.8
			) {
				return {
					status: 401,
				}
			}
			++i
		}

		// Initialize the comment object
		const commentsStorageClass = AV.Object.extend("nexment_comments")
		const commentsStorage = new commentsStorageClass()
		commentsStorage.set("identifier", info.identifier)
		commentsStorage.set("ID", info.ID)
		commentsStorage.set("name", info.name)
		commentsStorage.set("email", info.email)
		commentsStorage.set("content", info.content)

		// If current comment is a reply
		if (info.reply && info.replyOID) {
			// Set reply ID for current comment
			commentsStorage.set("reply", info.reply)

			// Get reply-to comment object
			const replyToObject = await AV.Object.createWithoutData(
				"nexment_comments",
				info.replyOID
			)
			replyToObject.set("hasReplies", true)

			// Email when replied
			const query = new AV.Query("nexment_comments")
			const replyToEmailStatus = await query
				.get(info.replyOID)
				.then((item: { get: (arg0: string) => any }) => {
					return [item.get("emailWhenReplied"), item.get("email")]
				})
			if (replyToEmailStatus[0]) {
				sendEmail(
					info.name,
					replyToEmailStatus[1],
					converter.makeHtml(info.content),
					window.location.href
				)
			}

			// Update the comment currently replying to
			await replyToObject.save().then(
				() => {
					console.log("Nexment: Comment sent successfully")
				},
				(error: any) => {
					console.log(error)
				}
			)
		}

		if (info.tag) {
			commentsStorage.set("tag", info.tag)
		}

		if (info.ewr) {
			commentsStorage.set("emailWhenReplied", info.ewr)
		}

		if (info.link) {
			commentsStorage.set("link", cleanLink(info.link))
		}

		// Save the comment
		return await commentsStorage.save().then(
			(savedComment: any) => {
				return {
					status: 201,
					savedComment: savedComment,
				}
			},
			() => {
				return {
					status: 500,
				}
			}
		)
	} else {
		return {
			status: 500,
		}
	}
}

export default useSavingComment
