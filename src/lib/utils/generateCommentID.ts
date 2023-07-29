/**
 * Generate comment ID based on Unix timestamp
 *
 * @returns {{status:number,idData:number}}
 */
const generateCommentID = (): { status: number; idData: number } => {
	let ID: number = new Date().valueOf() + Math.ceil(Math.random() * 10)
	return {
		status: 201,
		idData: ID,
	}
}

export default generateCommentID
