import { useState, useCallback } from "react"

export interface ReplyTarget {
	id: number
	oid: string
	name: string
	content: string
}

export function useReplyTarget(initial?: ReplyTarget | null) {
	const [target, setTarget] = useState<ReplyTarget | null>(initial ?? null)
	const [random, setRandom] = useState(Math.random())

	const setReply = useCallback(
		(id: number, oid: string, name: string, content: string) => {
			setTarget({ id, oid, name, content })
			setRandom(Math.random())
		},
		[]
	)

	const clearReply = useCallback(() => {
		setTarget(null)
	}, [])

	return { target, random, setReply, clearReply } as const
}
