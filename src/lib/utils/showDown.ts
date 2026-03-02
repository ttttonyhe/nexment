import showdown from "showdown"
import DOMPurify from "dompurify"

const converter = new showdown.Converter()
converter.setOption("tables", true)
converter.setOption("emojis", true)
converter.setOption("strikethrough", true)
converter.setOption("simpleLineBreaks", true)
converter.setOption("openLinksInNewWindow", true)
converter.setOption("simplifiedAutoLink", true)

const cache = new Map<string, string>()
const MAX_CACHE_SIZE = 500

export function renderMarkdown(text: string): string {
	const cached = cache.get(text)
	if (cached) return cached

	const html = DOMPurify.sanitize(converter.makeHtml(text))

	if (cache.size >= MAX_CACHE_SIZE) {
		const firstKey = cache.keys().next().value
		if (firstKey !== undefined) cache.delete(firstKey)
	}
	cache.set(text, html)

	return html
}

export default converter
