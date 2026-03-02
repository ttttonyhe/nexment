import { useMemo, useRef, useEffect } from "react"
import "../../styles/container.scss"
import getIdentifier from "../../lib/utils/getIdentifier"
import CommentList from "../sections/CommentList"
import { NexmentConfig, Provider } from "../../lib/utils/configContext"

const NexmentContainer = (Props: { config: NexmentConfig }) => {
	const pageKey = Props.config.pageKey ? Props.config.pageKey : getIdentifier()
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = containerRef.current
		if (!el) return
		const observer = new ResizeObserver(([entry]) => {
			document.documentElement.style.setProperty(
				"--nexment-container-width",
				`${entry.contentRect.width}px`
			)
		})
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	const config = useMemo(
		() => Props.config,
		[
			Props.config.pageKey,
			Props.config.supabase?.url,
			Props.config.supabase?.anonKey,
			Props.config.neon?.authUrl,
			Props.config.neon?.dataApiUrl,
			Props.config.admin.name,
			Props.config.admin.email,
			Props.config.email?.endpoint,
			Props.config.features?.linkInput,
			Props.config.features?.replyListModal,
			Props.config.features?.replyEmailNotifications,
			Props.config.features?.descriptionTag,
		]
	)

	return (
		<div className="nexment-container" ref={containerRef}>
			<Provider value={config}>
				<CommentList type="primary" pageKey={pageKey} />
			</Provider>
		</div>
	)
}

export default NexmentContainer
