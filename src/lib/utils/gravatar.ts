import { md5 } from "js-md5"

const hashCache = new Map<string, string>()

export function getGravatarUrl(email: string): string {
	let hash = hashCache.get(email)
	if (!hash) {
		hash = md5(email)
		hashCache.set(email, hash)
	}
	return `https://gravatar.loli.net/avatar/${hash}?d=mp`
}
