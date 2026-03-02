import React from "react"
import NexmentDialog from "./Dialog"
import "../../styles/modal.scss"
import adminLogin from "../../lib/database/adminLogin"
import translate from "../../lib/translation/index"
import Context, { NexmentConfig } from "../../lib/utils/configContext"

const VerificationModal = (Props: {
	visibilityFunction?: (visible: boolean) => void
	config: NexmentConfig
}) => {
	const NexmentConfigs: NexmentConfig = React.useContext(Context)
	const Translation = translate.use().text

	const [notificationModalStatus, setNotificationModalStatus] =
		React.useState(true)
	const [password, setPassword] = React.useState("")
	const [loginText, setLoginText] = React.useState("Login")

	const handleCloseNotification = () => {
		setNotificationModalStatus(false)
		Props.visibilityFunction?.(false)
	}

	const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
	}

	const loginAction = async () => {
		setLoginText("Verifying...")
		const returnData = await adminLogin(
			NexmentConfigs.admin.name,
			NexmentConfigs.admin.email,
			password,
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
		<NexmentDialog
			open={notificationModalStatus}
			onClose={handleCloseNotification}
			className="nexment-modal-notification"
			animation="fade"
		>
			<div className="nexment-modal-text">
				<h1>{Translation.verification}</h1>
				<p>{Translation.verifyDes}</p>
			</div>
			<div className="nexment-modal-input-group">
				<input placeholder={Translation.verifyPwd} onChange={handlePwdChange} />
				<button onClick={loginAction}>{loginText}</button>
			</div>
		</NexmentDialog>
	)
}

export default VerificationModal
