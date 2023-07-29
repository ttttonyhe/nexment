import React from "react"
import Rodal from "rodal"
import "../../assets/style/modal.scss"
import adminLogin from "../../lib/database/adminLoging"
import translate from "../../lib/translation/index"
import Context, { NexmentConfig } from "../../lib/utils/configContext"

const VerificationModal = (Props: {
	visibilityFunction?: Function
	config: NexmentConfig
}) => {
	// Configs
	const NexmentConfigs: NexmentConfig = React.useContext(Context)

	// Translation
	const Translation = translate.use().text

	// Modal state
	const [notificationModalStatus, setNotificationModalStatus] =
		React.useState<boolean>(true)

	// Admin state
	const [password, setPassword] = React.useState<string>()
	const [loginText, setLoginText] = React.useState<string>("Login")

	// Modal closing event handler
	const handleCloseNotification = () => {
		setNotificationModalStatus(!notificationModalStatus)
		if (Props.visibilityFunction) {
			// Change visibility state in CommentsList
			Props.visibilityFunction(false)
		}
	}

	// Admin event handler
	const handlePwdChange = (e: {
		target: { value: React.SetStateAction<string | undefined> }
	}) => {
		setPassword(e.target.value)
	}

	/**
	 * Login event handler
	 *
	 */
	const loginAction = async () => {
		setLoginText("Verifying...")
		const returnData = await adminLogin(
			NexmentConfigs.admin.name,
			NexmentConfigs.admin.email,
			password || "",
			NexmentConfigs
		)
		if (returnData.status !== 200) {
			alert(returnData.msg)
			setLoginText("Login")
		} else {
			setLoginText("Success")
			handleCloseNotification()
		}
	}

	return (
		<Rodal
			visible={notificationModalStatus}
			onClose={() => {
				handleCloseNotification()
			}}
			className="nexment-modal-notification"
			animation="fade"
		>
			<div className="nexment-modal-text">
				<h1>{Translation.verification}</h1>
				<p>{Translation.verifyDes}</p>
			</div>
			<div className="nexment-modal-input-group">
				<input placeholder={Translation.verifyPwd} onChange={handlePwdChange} />
				<button
					onClick={() => {
						loginAction()
					}}
				>
					{loginText}
				</button>
			</div>
		</Rodal>
	)
}

export default VerificationModal
