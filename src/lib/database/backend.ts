export interface CommentRow {
	id: string
	comment_id: number
	identifier: string
	name: string
	content: string
	created_at: string
	email: string
	tag: string
	link: string
	has_replies: boolean
	reply: number | null
	email_when_replied: boolean
}

export interface NexmentUser {
	id: string
	email?: string
	name?: string
}

export interface BackendError {
	message: string
}

export interface NexmentBackend {
	initAuth(): Promise<NexmentUser | null>
	signIn(
		email: string,
		password: string
	): Promise<{ user: NexmentUser | null; error?: string }>
	signUp(
		email: string,
		password: string,
		name: string
	): Promise<{ user: NexmentUser | null; error?: string }>
	signOut(): Promise<void>

	queryComments(
		identifier: string | number
	): Promise<{ data: CommentRow[] | null; error: BackendError | null }>
	insertComment(
		comment: Record<string, any>
	): Promise<{ data: CommentRow | null; error: BackendError | null }>
	updateComment(
		id: string,
		updates: Record<string, any>
	): Promise<{ error: BackendError | null }>
	getComment(
		id: string,
		fields: string
	): Promise<{ data: Record<string, any> | null; error: BackendError | null }>
}
