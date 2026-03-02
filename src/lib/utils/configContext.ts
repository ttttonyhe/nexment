import React from "react"

interface NexmentConfigBase {
	pageKey?: string
	features?: {
		linkInput?: boolean
		replyListModal?: boolean
		replyEmailNotifications?: boolean
		descriptionTag?: boolean
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

export type NexmentConfig = NexmentConfigBase &
	(
		| { supabase: { url: string; anonKey: string }; neon?: undefined }
		| { neon: { authUrl: string; dataApiUrl: string }; supabase?: undefined }
	)

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
