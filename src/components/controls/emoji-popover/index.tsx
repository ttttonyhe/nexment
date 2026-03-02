import React from "react"
import { Popover } from "react-tiny-popover"
import Icon from "../../icon"

const EmojiCard = (Props: { handler: (emoji: string) => void }) => {
	const [emojiPopoverStatus, setEmojiPopoverStatus] = React.useState(false)
	const [emojis, setEmojis] = React.useState<string[][] | null>(null)

	const toggleEmojiCard = () => {
		if (!emojiPopoverStatus && !emojis) {
			import("./emoji").then((mod) => setEmojis(mod.default))
		}
		setEmojiPopoverStatus(!emojiPopoverStatus)
	}

	const emojiContent = () => (
		<div className="nexment-emoji-container">
			{emojis?.map((cate) => (
				<div className="nexment-emoji-section" key={cate[0]}>
					<div className="nexment-emoji-section-header">
						<b>{cate[0]}</b>
					</div>
					<div className="nexment-emoji-section-box">
						<div className="nexment-emoji-section-container">
							{cate.slice(1).map((item) => (
								<span
									key={item}
									onClick={() => {
										Props.handler(item)
										toggleEmojiCard()
									}}
								>
									{item}
								</span>
							))}
						</div>
					</div>
				</div>
			))}
		</div>
	)

	return (
		<Popover
			isOpen={emojiPopoverStatus}
			positions={["right", "bottom", "left", "top"]}
			content={emojiContent}
			containerClassName="nexment-popover-container"
			onClickOutside={toggleEmojiCard}
		>
			<button type="button" title="Emoji" onClick={toggleEmojiCard}>
				<Icon name="emoji" />
			</button>
		</Popover>
	)
}

export default EmojiCard
