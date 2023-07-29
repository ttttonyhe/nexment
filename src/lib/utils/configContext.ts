import React from "react"

// Nexment Configuration Interface
export interface NexmentConfig {
	pageKey?: string
	enableLinkInput?: boolean
	enableReplyListModal?: boolean
	enableReplyEmail?: boolean
	descriptionTag?: boolean
	leancloud: {
		appId: string
		appKey: string
		serverURL: string
	}
	admin: {
		name: string
		email: string
	}
	blackList?: {
		name?: string
		email?: string
		link?: string
		keyword?: string
	}[]
}

const Context = React.createContext<NexmentConfig>({
	leancloud: {
		appId: "",
		appKey: "",
		serverURL: "",
	},
	admin: {
		name: "",
		email: "",
	},
})

export const Provider = Context.Provider

export default Context
