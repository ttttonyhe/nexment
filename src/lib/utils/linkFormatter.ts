export default function formatLink(link: string) {
	return (link && link.indexOf("http") == -1 ? "//" : "") + link
}
