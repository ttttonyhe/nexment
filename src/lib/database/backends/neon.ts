import { createClient } from "@neondatabase/neon-js"
import { NexmentBackend, NexmentUser, CommentRow } from "../backend"

export const createNeonBackend = (
	authUrl: string,
	dataApiUrl: string
): NexmentBackend => {
	const client = createClient({
		auth: { url: authUrl, allowAnonymous: true },
		dataApi: { url: dataApiUrl },
	})

	return {
		async initAuth(): Promise<NexmentUser | null> {
			const { data: session } = await client.auth.getSession()
			if (!session?.user) return null
			return {
				id: session.user.id,
				email: session.user.email,
				name: session.user.name,
			}
		},

		async signIn(email: string, password: string) {
			try {
				const { data, error } = await client.auth.signIn.email({
					email,
					password,
				})
				if (error || !data?.user) {
					return {
						user: null,
						error: error?.message || "Sign in failed",
					}
				}
				return {
					user: {
						id: data.user.id,
						email: data.user.email,
						name: data.user.name,
					},
				}
			} catch (err: any) {
				return { user: null, error: err.message || "Sign in failed" }
			}
		},

		async signUp(email: string, password: string, name: string) {
			try {
				const { data, error } = await client.auth.signUp.email({
					email,
					password,
					name,
				})
				if (error || !data?.user) {
					return {
						user: null,
						error: error?.message || "Sign up failed",
					}
				}
				return {
					user: {
						id: data.user.id,
						email: data.user.email,
						name: data.user.name,
					},
				}
			} catch (err: any) {
				return { user: null, error: err.message || "Sign up failed" }
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
