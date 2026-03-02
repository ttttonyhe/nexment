import { NexmentConfig } from "../utils/configContext"
import getSupabase from "./initiation"
import { setCurrentUser } from "./initiation"

const adminLogin = async (
	name: string,
	email: string,
	pwd: string,
	config: NexmentConfig
) => {
	const supabase = getSupabase(config.supabase.url, config.supabase.anonKey)

	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password: pwd,
	})

	if (!error && data.user) {
		setCurrentUser(data.user)
		return {
			status: 200,
			msg: "Login success",
		}
	}

	// If login fails, try to sign up (first-time admin registration)
	if (name && email && pwd) {
		const { data: signUpData, error: signUpError } =
			await supabase.auth.signUp({
				email,
				password: pwd,
				options: {
					data: { username: name },
				},
			})

		if (!signUpError && signUpData.user) {
			setCurrentUser(signUpData.user)
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
