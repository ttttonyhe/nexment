// LeanCloud storage initiation
import AV from "leancloud-storage"

// To avoid reinitialization
var initCount = 0
/**
 * LeanCloud Database Initiation
 *
 * @param {string} appId
 * @param {string} appKey
 * @param {string} serverURL
 * @returns
 */
const leanCloud = (appId: string, appKey: string, serverURL: string) => {
	if (initCount === 0) {
		AV.init({
			appId: appId,
			appKey: appKey,
			serverURL: serverURL,
		})
		initCount++
	}
	return AV
}

export default leanCloud
