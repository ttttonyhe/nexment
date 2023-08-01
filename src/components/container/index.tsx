import "../../styles/container.scss"
import getIdentifier from "../../lib/utils/getIdentifier"
import CommentList from "../sections/CommentList"
import { NexmentConfig, Provider } from "../../lib/utils/configContext"

/**
 * Nexment Container
 * basic structure of a nexment instance
 *
 * @param {{ config: NexmentConfig }} Props
 * @returns
 */
const NexmentContainer = (Props: { config: NexmentConfig }) => {
	// Get / Generate PageKey
	const pageKey = Props.config.pageKey
		? Props.config.pageKey
		: getIdentifier().identifierData

	// Render structure
	const nexmentContainer = (
		<div className="nexment-container">
			<Provider value={Props.config}>
				<CommentList type="primary" pageKey={pageKey} />
			</Provider>
		</div>
	)

	return nexmentContainer
}

export default NexmentContainer
