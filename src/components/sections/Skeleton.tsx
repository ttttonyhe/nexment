import React from "react"

const shimmerStyle: React.CSSProperties = {
	background: "linear-gradient(90deg, #f3f3f3 25%, #ecebeb 50%, #f3f3f3 75%)",
	backgroundSize: "200% 100%",
	animation: "nexment-shimmer 1.5s infinite",
	borderRadius: 3,
}

const CommentSkeleton = React.memo(
	({ variant = "full" }: { variant?: "full" | "compact" }) => {
		const height = variant === "full" ? 124 : 45

		return (
			<div
				className={
					variant === "full"
						? "nexment-loading"
						: "nexment-loading-index"
				}
			>
				<style>{`
					@keyframes nexment-shimmer {
						0% { background-position: 200% 0; }
						100% { background-position: -200% 0; }
					}
				`}</style>
				<svg
					width="100%"
					height={height}
					viewBox={`0 0 400 ${height}`}
					preserveAspectRatio="xMinYMin meet"
				>
					<foreignObject width="400" height={height}>
						<div style={{ display: "flex", gap: 12, padding: "8px 0" }}>
							<div
								style={{
									...shimmerStyle,
									width: 40,
									height: 40,
									borderRadius: "50%",
									flexShrink: 0,
								}}
							/>
							<div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
								<div style={{ ...shimmerStyle, height: 10, width: "70%" }} />
								<div style={{ ...shimmerStyle, height: 10, width: "50%" }} />
								{variant === "full" && (
									<>
										<div style={{ ...shimmerStyle, height: 6, width: "60%", marginTop: 8 }} />
										<div style={{ ...shimmerStyle, height: 6, width: "50%" }} />
										<div style={{ ...shimmerStyle, height: 6, width: "30%" }} />
									</>
								)}
							</div>
						</div>
					</foreignObject>
				</svg>
			</div>
		)
	}
)

export default CommentSkeleton
