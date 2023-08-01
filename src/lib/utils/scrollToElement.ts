export const scrollToElementById = (id: string) => {
	const commentAreaOffsetTop = document.getElementById(id)?.offsetTop || 100
	window.scrollTo({
		top: commentAreaOffsetTop - 100,
		behavior: "smooth",
	})
}
