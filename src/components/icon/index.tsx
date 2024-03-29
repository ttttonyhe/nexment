const IconSvgs = {
	admin: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="8"
			height="8"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M12 14v8H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm2.595 5.812a3.51 3.51 0 0 1 0-1.623l-.992-.573 1-1.732.992.573A3.496 3.496 0 0 1 17 14.645V13.5h2v1.145c.532.158 1.012.44 1.405.812l.992-.573 1 1.732-.992.573a3.51 3.51 0 0 1 0 1.622l.992.573-1 1.732-.992-.573a3.496 3.496 0 0 1-1.405.812V22.5h-2v-1.145a3.496 3.496 0 0 1-1.405-.812l-.992.573-1-1.732.992-.572zM18 17a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
				fill="rgba(46,105,255,1)"
			/>
		</svg>
	),
	reply: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="13"
			height="13"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M5.828 7l2.536 2.536L6.95 10.95 2 6l4.95-4.95 1.414 1.414L5.828 5H13a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H5.828z"
				fill="currentColor"
			/>
		</svg>
	),
	viewReply: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path
				d="M2 8.99374C2 5.68349 4.67654 3 8.00066 3H15.9993C19.3134 3 22 5.69478 22 8.99374V21H8.00066C4.68659 21 2 18.3052 2 15.0063V8.99374ZM20 19V8.99374C20 6.79539 18.2049 5 15.9993 5H8.00066C5.78458 5 4 6.78458 4 8.99374V15.0063C4 17.2046 5.79512 19 8.00066 19H20ZM14 11H16V13H14V11ZM8 11H10V13H8V11Z"
				fill="currentColor"
			/>
		</svg>
	),
	resetReply: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="20"
			height="20"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M2.808 1.393l19.799 19.8-1.415 1.414-3.608-3.608L6.455 19 2 22.5V4c0-.17.042-.329.116-.469l-.723-.723 1.415-1.415zm1.191 4.02L4 18.385 5.763 17h9.821L4 5.412zM21 3a1 1 0 0 1 1 1v13.785l-2-2V5L9.213 4.999 7.214 3H21z"
				fill="currentColor"
			/>
		</svg>
	),
	resetFill: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="20"
			height="20"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zM12 10H8v2h4v3l4-4-4-4v3z"
				fill="currentColor"
			/>
		</svg>
	),
	emoji: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="20"
			height="20"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-5-8h2a3 3 0 0 0 6 0h2a5 5 0 0 1-10 0z"
				fill="currentColor"
			/>
		</svg>
	),
	logout: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="20"
			height="20"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2a9.985 9.985 0 0 1 8 4h-2.71a8 8 0 1 0 .001 12h2.71A9.985 9.985 0 0 1 12 22zm7-6v-3h-8v-2h8V8l5 4-5 4z"
				fill="currentColor"
			/>
		</svg>
	),
	tag: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="20"
			height="20"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M10.9 2.1l9.899 1.415 1.414 9.9-9.192 9.192a1 1 0 0 1-1.414 0l-9.9-9.9a1 1 0 0 1 0-1.414L10.9 2.1zm.707 2.122L3.828 12l8.486 8.485 7.778-7.778-1.06-7.425-7.425-1.06zm2.12 6.364a2 2 0 1 1 2.83-2.829 2 2 0 0 1-2.83 2.829z"
				fill="currentColor"
			/>
		</svg>
	),
	emailFill: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="20"
			height="20"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M20 7.238l-7.928 7.1L4 7.216V19h7.07a6.95 6.95 0 0 0 .604 2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v8.255a6.972 6.972 0 0 0-2-.965V7.238zM19.501 5H4.511l7.55 6.662L19.502 5zm-2.794 15.708a3 3 0 0 0 4.001-4.001l-4.001 4zm-1.415-1.415l4.001-4a3 3 0 0 0-4.001 4.001zM18 23a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
				fill="currentColor"
			/>
		</svg>
	),
	email: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="20"
			height="20"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm9.06 8.683L5.648 6.238 4.353 7.762l7.72 6.555 7.581-6.56-1.308-1.513-6.285 5.439z"
				fill="currentColor"
			/>
		</svg>
	),
	cancel: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="16"
			height="16"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
				fill="currentColor"
			/>
		</svg>
	),
	markdown: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="20"
			height="20"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm3 10.5H5v-7h2l2 2 2-2h2v7h-2v-4l-2 2-2-2v4zm11-3h2l-3 3-3-3h2v-4h2v4z"
				fill="currentColor"
			/>
		</svg>
	),
	markdownFill: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="20"
			height="20"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm4 12.5v-4l2 2 2-2v4h2v-7h-2l-2 2-2-2H5v7h2zm11-3v-4h-2v4h-2l3 3 3-3h-2z"
				fill="currentColor"
			/>
		</svg>
	),
	down: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="16"
			height="16"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"
				fill="currentColor"
			/>
		</svg>
	),
	comments: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="36"
			height="36"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zm-.692-2H20V5H4v13.385L5.763 17zM8 10h8v2H8v-2z"
				fill="rgba(131,146,166,1)"
			/>
		</svg>
	),
	commentsError: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="36"
			height="36"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zM4 18.385L5.763 17H20V5H4v13.385zM13.414 11l2.475 2.475-1.414 1.414L12 12.414 9.525 14.89l-1.414-1.414L10.586 11 8.11 8.525l1.414-1.414L12 9.586l2.475-2.475 1.414 1.414L13.414 11z"
				fill="rgba(131,146,166,1)"
			/>
		</svg>
	),
	avatar: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="20"
			height="20"
		>
			<path
				d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12.1597 16C10.1243 16 8.29182 16.8687 7.01276 18.2556C8.38039 19.3474 10.114 20 12 20C13.9695 20 15.7727 19.2883 17.1666 18.1081C15.8956 16.8074 14.1219 16 12.1597 16ZM12 4C7.58172 4 4 7.58172 4 12C4 13.8106 4.6015 15.4807 5.61557 16.8214C7.25639 15.0841 9.58144 14 12.1597 14C14.6441 14 16.8933 15.0066 18.5218 16.6342C19.4526 15.3267 20 13.7273 20 12C20 7.58172 16.4183 4 12 4ZM12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5ZM12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7Z"
				fill="currentColor"
			/>
		</svg>
	),
	tagFill: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="20"
			height="20"
		>
			<path fill="none" d="M0 0h24v24H0z" />
			<path
				d="M10.9 2.1l9.899 1.415 1.414 9.9-9.192 9.192a1 1 0 0 1-1.414 0l-9.9-9.9a1 1 0 0 1 0-1.414L10.9 2.1zm2.828 8.486a2 2 0 1 0 2.828-2.829 2 2 0 0 0-2.828 2.829z"
				fill="currentColor"
			/>
		</svg>
	),
	link: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path
				d="M18.3643 15.5353L16.95 14.1211L18.3643 12.7069C20.3169 10.7543 20.3169 7.58847 18.3643 5.63585C16.4116 3.68323 13.2458 3.68323 11.2932 5.63585L9.87898 7.05007L8.46477 5.63585L9.87898 4.22164C12.6127 1.48797 17.0448 1.48797 19.7785 4.22164C22.5121 6.95531 22.5121 11.3875 19.7785 14.1211L18.3643 15.5353ZM15.5358 18.3638L14.1216 19.778C11.388 22.5117 6.9558 22.5117 4.22213 19.778C1.48846 17.0443 1.48846 12.6122 4.22213 9.87849L5.63634 8.46428L7.05055 9.87849L5.63634 11.2927C3.68372 13.2453 3.68372 16.4112 5.63634 18.3638C7.58896 20.3164 10.7548 20.3164 12.7074 18.3638L14.1216 16.9496L15.5358 18.3638ZM14.8287 7.75717L16.2429 9.17139L9.17187 16.2425L7.75766 14.8282L14.8287 7.75717Z"
				fill="currentColor"
			/>
		</svg>
	),
	arrowRight: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path
				d="M13.1714 12.0007L8.22168 7.05093L9.63589 5.63672L15.9999 12.0007L9.63589 18.3646L8.22168 16.9504L13.1714 12.0007Z"
				fill="currentColor"
			/>
		</svg>
	),
	arrowRightFill: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path d="M16 12L10 18V6L16 12Z" fill="currentColor" />
		</svg>
	),
	loader: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path
				d="M18.364 5.63604L16.9497 7.05025C15.683 5.7835 13.933 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12H21C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.4853 3 16.7353 4.00736 18.364 5.63604Z"
				fill="currentColor"
			/>
		</svg>
	),
	return: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path
				d="M19.0003 10.0003L19.0004 19.0002L17.0004 19.0002L17.0003 12.0003L6.82845 12.0002L10.7782 15.9499L9.36396 17.3642L3 11.0002L9.36396 4.63623L10.7782 6.05044L6.8284 10.0002L19.0003 10.0003Z"
				fill="currentColor"
			/>
		</svg>
	),
}

const Icon = ({ name }: { name: keyof typeof IconSvgs }) => {
	return IconSvgs[name]
}

export default Icon
