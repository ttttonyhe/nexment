const RESEND_API_KEY = "xxx"
const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST,OPTIONS",
}

export default {
	async fetch(request, _env, _ctx) {
		async function handleOptions(request) {
			if (
				request.headers.get("Origin") !== null &&
				request.headers.get("Access-Control-Request-Method") !== null &&
				request.headers.get("Access-Control-Request-Headers") !== null
			) {
				return new Response(null, {
					headers: {
						...CORS_HEADERS,
						"Access-Control-Allow-Headers": request.headers.get(
							"Access-Control-Request-Headers"
						),
					},
				})
			}

			return new Response(null, {
				headers: {
					Allow: "POST, OPTIONS",
				},
			})
		}

		async function handlePostRequest(request) {
			const requestBody = await request.json()

			if (!requestBody["toEmail"]) {
				return new Response("Target email missing.", {
					status: 400,
				})
			}

			async function gatherResponse(response) {
				const { headers } = response
				const contentType = headers.get("content-type") || ""
				if (contentType.includes("application/json")) {
					return JSON.stringify(await response.json())
				}
				return response.text()
			}

			const response = await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${RESEND_API_KEY}`,
				},
				body: JSON.stringify({
					from: "Nexment <no-reply@nexment.ouorz.com>",
					to: [requestBody["toEmail"]],
					subject: `You received a new reply from ${requestBody["fromName"]}!`,
					html: `
            <br/>
            <h3><b>You received a new reply on Nexment.</b></h3>
            <br/>
            <p>From <i>${requestBody["fromName"]}</i>:</p>
            <p>> ${requestBody["content"]}</p>
            <br/>
            <p>Click <a href="${requestBody["url"]}">here</a> to reply back.</p>
          `,
				}),
			})

			const results = await gatherResponse(response)
			return new Response(results, {
				headers: CORS_HEADERS,
			})
		}

		switch (request.method.toUpperCase()) {
			case "POST":
				return handlePostRequest(request)
			case "OPTIONS":
				return handleOptions(request)
			default:
				return new Response("Supported request methods: OPTIONS, POST", {
					headers: CORS_HEADERS,
				})
		}
	},
}
