import { createClient } from "@supabase/supabase-js"
import { NexmentBackend, NexmentUser, CommentRow } from "../backend"

export const createSupabaseBackend = (
	url: string,
	anonKey: string
): NexmentBackend => {
	const client = createClient(url, anonKey)

	return {
		async initAuth(): Promise<NexmentUser | null> {
			const {
				data: { session },
			} = await client.auth.getSession()
			if (!session?.user) return null
			return {
				id: session.user.id,
				email: session.user.email,
				name: session.user.user_metadata?.username,
			}
		},

		async signIn(email: string, password: string) {
			const { data, error } = await client.auth.signInWithPassword({
				email,
				password,
			})
			if (error || !data.user) {
				return {
					user: null,
					error: error?.message || "Sign in failed",
				}
			}
			return {
				user: {
					id: data.user.id,
					email: data.user.email,
					name: data.user.user_metadata?.username,
				},
			}
		},

		async signUp(email: string, password: string, name: string) {
			const { data, error } = await client.auth.signUp({
				email,
				password,
				options: { data: { username: name } },
			})
			if (error || !data.user) {
				return {
					user: null,
					error: error?.message || "Sign up failed",
				}
			}
			return {
				user: {
					id: data.user.id,
					email: data.user.email,
					name: data.user.user_metadata?.username,
				},
			}
		},

		async signOut() {
			await client.auth.signOut()
		},

		async queryComments(identifier: string | number) {
			const { data, error } = await client
				.from("nexment_comments")
				.select("*")
				.eq("identifier", identifier)
				.order("created_at", { ascending: false })
			return {
				data: data as CommentRow[] | null,
				error: error ? { message: error.message } : null,
			}
		},

		async insertComment(comment: Record<string, any>) {
			const { data, error } = await client
				.from("nexment_comments")
				.insert(comment)
				.select()
				.single()
			return {
				data: data as CommentRow | null,
				error: error ? { message: error.message } : null,
			}
		},

		async updateComment(id: string, updates: Record<string, any>) {
			const { error } = await client
				.from("nexment_comments")
				.update(updates)
				.eq("id", id)
			return { error: error ? { message: error.message } : null }
		},

		async getComment(id: string, fields: string) {
			const { data, error } = await client
				.from("nexment_comments")
				.select(fields)
				.eq("id", id)
				.single()
			return {
				data,
				error: error ? { message: error.message } : null,
			}
		},
	}
}
