const generateCommentID = (): number =>
	Date.now() + Math.ceil(Math.random() * 10)

export default generateCommentID
