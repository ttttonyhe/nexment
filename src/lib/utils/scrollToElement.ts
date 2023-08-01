const getOffsetTop = (element: any) => {
	let offsetTop = 0
	while (element) {
		offsetTop += element.offsetTop
		element = element.offsetParent
	}
	return offsetTop
}

export const scrollToElementById = (id: string) => {
	const element = document.getElementById(id)
	if (!element) return

	const commentAreaOffsetTop = getOffsetTop(document.getElementById(id)) || 100

	window.scrollTo({
		top: commentAreaOffsetTop - 100,
		behavior: "smooth",
	})
}
