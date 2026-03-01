import { createClient, SupabaseClient, User } from "@supabase/supabase-js"

let supabaseInstance: SupabaseClient | null = null
let cachedUser: User | null = null

const getSupabase = (url: string, anonKey: string): SupabaseClient => {
	if (!supabaseInstance) {
		supabaseInstance = createClient(url, anonKey)
	}
	return supabaseInstance
}

export const getCurrentUser = (): User | null => cachedUser

export const setCurrentUser = (user: User | null) => {
	cachedUser = user
}

export const initAuth = async (
	supabase: SupabaseClient
): Promise<User | null> => {
	const {
		data: { session },
	} = await supabase.auth.getSession()
	cachedUser = session?.user ?? null
	return cachedUser
}

export default getSupabase
