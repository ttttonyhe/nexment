import React from "react"

const shimmerStyle: React.CSSProperties = {
	background: "linear-gradient(90deg, #f3f3f3 25%, #ecebeb 50%, #f3f3f3 75%)",
	backgroundSize: "200% 100%",
	animation: "nexment-shimmer 1.5s infinite",
	borderRadius: 3,
}

const CommentSkeleton = React.memo(
	({ variant = "full" }: { variant?: "full" | "compact" }) => {
		return (
			<div
				className={
					variant === "full" ? "nexment-loading" : "nexment-loading-index"
				}
			>
				<style>{`
					@keyframes nexment-shimmer {
						0% { background-position: 200% 0; }
						100% { background-position: -200% 0; }
					}
				`}</style>
				<div
					style={{ display: "flex", gap: 12, padding: "8px 0", width: "100%" }}
				>
					<div
						style={{
							...shimmerStyle,
							width: 40,
							height: 40,
							borderRadius: "50%",
							flexShrink: 0,
						}}
					/>
					<div
						style={{
							flex: 1,
							display: "flex",
							flexDirection: "column",
							gap: 8,
							width: "100%",
						}}
					>
						<div style={{ ...shimmerStyle, height: 15, width: "100%" }} />
						<div style={{ ...shimmerStyle, height: 15, width: "70%" }} />
						{variant === "full" && (
							<>
								<div
									style={{
										...shimmerStyle,
										height: 6,
										width: "60%",
										marginTop: 8,
									}}
								/>
								<div style={{ ...shimmerStyle, height: 6, width: "50%" }} />
								<div style={{ ...shimmerStyle, height: 6, width: "30%" }} />
							</>
						)}
					</div>
				</div>
			</div>
		)
	}
)

export default CommentSkeleton
