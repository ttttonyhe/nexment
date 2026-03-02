type Language = "en" | "zh"

const availableLanguages: Language[] = ["en", "zh"]
const fallback: Language = "en"

export function getBestLanguage(): Language {
	const deviceLanguage =
		typeof navigator !== "undefined" ? navigator.language : "en"
	return (
		availableLanguages.find((al) => deviceLanguage.startsWith(al)) || fallback
	)
}

const translations = {
	comments: { zh: "条评论", en: "Comments" },
	poweredBy: { zh: "驱动来自", en: "Powered by" },
	serviceError: { zh: "Nexment 服务错误", en: "Nexment Service Error" },
	problemShooting: { zh: "错误诊断", en: "Problem Shooting" },
	problemDes: {
		zh: "请确认你已经在 Supabase 添加了一个名为 [nexment_comments] 的表",
		en: "Make sure you have created a table named [nexment_comments] on Supabase",
	},
	documentation: { zh: "参考文档", en: "Documentation" },
	reply: { zh: "条回复", en: "reply" },
	replies: { zh: "条回复", en: "replies" },
	noComments: { zh: "暂无评论", en: "No Comments Yet" },
	replyList: { zh: "回复列表", en: "Replies" },
	name: { zh: "昵称", en: "Name" },
	email: { zh: "邮箱", en: "Email" },
	placeHolder: { zh: "键入一些内容吧", en: "Say something" },
	cancelReply: { zh: "取消回复", en: "Cancel" },
	desTag: { zh: "描述标签", en: "Description Tag" },
	unSub: { zh: "取消订阅", en: "Unsubscribe" },
	sub: { zh: "订阅回复", en: "Subscribe for Replies" },
	avatar: { zh: "头像", en: "Gravatar" },
	mdPreview: { zh: "预览", en: "Markdown Preview" },
	stopPreview: { zh: "关闭预览", en: "Close Preview" },
	adminLogout: { zh: "退出登录", en: "Admin Logout" },
	submit: { zh: "发送评论", en: "Submit" },
	verification: { zh: "管理员验证", en: "Verification" },
	verifyDes: {
		zh: "请验证管理员密码 (首次密码输入将自动注册为管理员密码)",
		en: "Please verify your Nexment admin identity (first time login password will be set as admin password)",
	},
	verifyPwd: { zh: "管理员密码", en: "Admin password" },
	desTagDes: {
		zh: "使用描述标签让观众了解你的专业、知识和身份背景",
		en: "Add a description tag to help others know about you.",
	},
	confirm: { zh: "确认", en: "Confirm" },
	nothing: { zh: "无内容可预览", en: "Nothing to preview" },
	link: { zh: "站点链接", en: "URL" },
} as const

type TranslationKeys = keyof typeof translations
type ResolvedTranslations = { [K in TranslationKeys]: string }

const lang = getBestLanguage()

const resolved: ResolvedTranslations = Object.fromEntries(
	Object.entries(translations).map(([key, val]) => [key, val[lang]])
) as ResolvedTranslations

const translate = {
	use: () => ({ text: resolved }),
}

export default translate
