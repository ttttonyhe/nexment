import { NexmentBackend, NexmentUser } from "./backend"
import { NexmentConfig } from "../utils/configContext"
import { createSupabaseBackend } from "./backends/supabase"
import { createNeonBackend } from "./backends/neon"

let backendInstance: NexmentBackend | null = null
let cachedUser: NexmentUser | null = null

const getBackend = (config: NexmentConfig): NexmentBackend => {
	if (!backendInstance) {
		if (config.supabase) {
			backendInstance = createSupabaseBackend(
				config.supabase.url,
				config.supabase.anonKey
			)
		} else {
			backendInstance = createNeonBackend(
				config.neon.authUrl,
				config.neon.dataApiUrl
			)
		}
	}
	return backendInstance
}

export const getCurrentUser = (): NexmentUser | null => cachedUser

export const setCurrentUser = (user: NexmentUser | null) => {
	cachedUser = user
}

export const initAuth = async (
	backend: NexmentBackend
): Promise<NexmentUser | null> => {
	cachedUser = await backend.initAuth()
	return cachedUser
}

export default getBackend
