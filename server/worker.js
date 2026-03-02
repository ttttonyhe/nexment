const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
}

export default {
	async fetch(request, env) {
		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					...CORS_HEADERS,
					"Access-Control-Allow-Headers":
						request.headers.get("Access-Control-Request-Headers") || "",
				},
			})
		}

		if (request.method !== "POST") {
			return new Response("Supported request methods: OPTIONS, POST", {
				headers: CORS_HEADERS,
			})
		}

		const body = await request.json()

		if (!body.toEmail) {
			return new Response(
				JSON.stringify({ error: "Target email missing" }),
				{ status: 400, headers: CORS_HEADERS }
			)
		}

		const apiKey = env.RESEND_API_KEY
		const fromAddress =
			env.RESEND_FROM_ADDRESS || "Nexment <no-reply@nexment.ouorz.com>"

		const response = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				from: fromAddress,
				to: [body.toEmail],
				subject: `You received a new reply from ${body.fromName}!`,
				html: `
					<br/>
					<h3><b>You received a new reply on Nexment.</b></h3>
					<br/>
					<p>From <i>${body.fromName}</i>:</p>
					<p>&gt; ${body.content}</p>
					<br/>
					<p>Click <a href="${body.url}">here</a> to reply back.</p>
				`,
			}),
		})

		const result = await response.json()
		return new Response(JSON.stringify(result), {
			status: response.ok ? 200 : 500,
			headers: CORS_HEADERS,
		})
	},
}
