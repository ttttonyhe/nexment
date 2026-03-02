import React, { useRef, useEffect, useCallback } from "react"

interface NexmentDialogProps {
	open: boolean
	onClose: () => void
	className?: string
	animation?: "fade" | "slideUp"
	children: React.ReactNode
}

const LOCK_CLASS = "nexment-scroll-locked"

const lockScroll = () => {
	document.documentElement.classList.add(LOCK_CLASS)
}

const unlockScroll = () => {
	document.documentElement.classList.remove(LOCK_CLASS)
}

const NexmentDialog = ({
	open,
	onClose,
	className,
	animation = "fade",
	children,
}: NexmentDialogProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const closingRef = useRef(false)

	const closeWithAnimation = useCallback(() => {
		const dialog = dialogRef.current
		if (!dialog || !dialog.open || closingRef.current) return

		closingRef.current = true
		dialog.classList.add("nexment-dialog-closing")

		let finished = false
		const finish = () => {
			if (finished) return
			finished = true
			dialog.classList.remove("nexment-dialog-closing")
			dialog.close()
			unlockScroll()
			closingRef.current = false
			onClose()
		}

		dialog.addEventListener("animationend", finish, { once: true })
		setTimeout(finish, 300)
	}, [onClose])

	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog) return

		if (open && !dialog.open && !closingRef.current) {
			dialog.showModal()
			lockScroll()
		}

		return () => {
			if (dialog.open && !closingRef.current) {
				dialog.close()
				unlockScroll()
			}
		}
	}, [open])

	const handleBackdropClick = useCallback(
		(e: React.MouseEvent<HTMLDialogElement>) => {
			if (e.target === dialogRef.current) {
				closeWithAnimation()
			}
		},
		[closeWithAnimation]
	)

	const handleCancel = useCallback(
		(e: React.SyntheticEvent) => {
			e.preventDefault()
			closeWithAnimation()
		},
		[closeWithAnimation]
	)

	return (
		<dialog
			ref={dialogRef}
			className={`nexment-dialog nexment-dialog-${animation}${
				className ? ` ${className}` : ""
			}`}
			onClick={handleBackdropClick}
			onCancel={handleCancel}
		>
			<div className="nexment-dialog-content">
				<button
					className="nexment-dialog-close"
					onClick={closeWithAnimation}
					aria-label="Close"
				/>
				{children}
			</div>
		</dialog>
	)
}

export default NexmentDialog
