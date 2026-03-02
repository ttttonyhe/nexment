import { NexmentConfig } from "../utils/configContext"
import getBackend from "./initiation"
import { setCurrentUser } from "./initiation"

const adminLogin = async (
	name: string,
	email: string,
	pwd: string,
	config: NexmentConfig
) => {
	const backend = getBackend(config)

	const { user } = await backend.signIn(email, pwd)

	if (user) {
		setCurrentUser(user)
		return {
			status: 200,
			msg: "Login success",
		}
	}

	if (name && email && pwd) {
		const { user: signUpUser } = await backend.signUp(email, pwd, name)

		if (signUpUser) {
			setCurrentUser(signUpUser)
			return {
				status: 200,
				msg: "Admin successfully registered",
			}
		}
	}

	return {
		status: 500,
		msg: "Login failed",
	}
}

export default adminLogin
