import { validate } from "email-validator"
import getSupabase from "./initiation"
import { getCurrentUser } from "./initiation"
import { renderMarkdown } from "../utils/showDown"
import { NexmentConfig } from "../utils/configContext"

function diceCoefficient(a: string, b: string): number {
	if (a === b) return 1
	if (a.length < 2 || b.length < 2) return 0
	const bigramsA = new Map<string, number>()
	for (let i = 0; i < a.length - 1; i++) {
		const bigram = a.substring(i, i + 2)
		bigramsA.set(bigram, (bigramsA.get(bigram) ?? 0) + 1)
	}
	let intersections = 0
	for (let i = 0; i < b.length - 1; i++) {
		const bigram = b.substring(i, i + 2)
		const count = bigramsA.get(bigram) ?? 0
		if (count > 0) {
			bigramsA.set(bigram, count - 1)
			intersections++
		}
	}
	return (2 * intersections) / (a.length + b.length - 2)
}

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

const sendEmail = async (
	endpoint: string,
	fromName: string,
	toEmail: string,
	content: string,
	url: string
) => {
	await fetch(endpoint, {
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

const cleanLink = (link: string) => {
	const finalLink = link.replace(/\s*/g, "")
	if (finalLink.startsWith("http://") || finalLink.startsWith("https://")) {
		return link
	} else {
		return "https://" + finalLink
	}
}

const saveComment = async (
	info: NewCommentItem,
	config: NexmentConfig
): Promise<{ status: number; savedComment?: any }> => {
	const supabase = getSupabase(config.supabase.url, config.supabase.anonKey)

	if (
		(info.email === config.admin.email || info.name === config.admin.name) &&
		!getCurrentUser()
	) {
		return {
			status: 501,
		}
	}

	const contentTrimed = info.content.trim()
	if (contentTrimed == "" || contentTrimed.length > 1000) {
		return {
			status: 400,
		}
	}

	if (
		info.identifier &&
		info.ID &&
		info.name &&
		info.email &&
		validate(info.email) &&
		info.content
	) {
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
				diceCoefficient(info.name, rule.name) > 0.6
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
				diceCoefficient(info.link, rule.link) > 0.8
			) {
				return {
					status: 401,
				}
			}
			++i
		}

		const newComment: Record<string, any> = {
			identifier: info.identifier,
			comment_id: info.ID,
			name: info.name,
			email: info.email,
			content: info.content,
		}

		if (info.reply && info.replyOID) {
			newComment.reply = info.reply

			// Update parent comment's has_replies flag
			await supabase
				.from("nexment_comments")
				.update({ has_replies: true })
				.eq("id", info.replyOID)

			// Check email notification preference
			const { data: parentComment } = await supabase
				.from("nexment_comments")
				.select("email_when_replied, email")
				.eq("id", info.replyOID)
				.single()

			if (parentComment?.email_when_replied && config.email?.endpoint) {
				sendEmail(
					config.email.endpoint,
					info.name,
					parentComment.email,
					renderMarkdown(info.content),
					window.location.href
				)
			}
		}

		if (info.tag) {
			newComment.tag = info.tag
		}

		if (info.ewr) {
			newComment.email_when_replied = info.ewr
		}

		if (info.link) {
			newComment.link = cleanLink(info.link)
		}

		const { data: savedComment, error } = await supabase
			.from("nexment_comments")
			.insert(newComment)
			.select()
			.single()

		if (error) {
			return {
				status: 500,
			}
		}

		return {
			status: 201,
			savedComment: savedComment,
		}
	} else {
		return {
			status: 500,
		}
	}
}

export default saveComment
