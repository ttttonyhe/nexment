import React from "react"

// Nexment Configuration Interface
export interface NexmentConfig {
	pageKey?: string
	features?: {
		linkInput?: boolean
		replyListModal?: boolean
		replyEmailNotifications?: boolean
		descriptionTag?: boolean
	}
	supabase: {
		url: string
		anonKey: string
	}
	admin: {
		name: string
		email: string
	}
	email?: {
		endpoint: string
	}
	blackList?: {
		name?: string
		email?: string
		link?: string
		keyword?: string
	}[]
}

const Context = React.createContext<NexmentConfig>({
	supabase: {
		url: "",
		anonKey: "",
	},
	admin: {
		name: "",
		email: "",
	},
})

export const Provider = Context.Provider

export default Context
