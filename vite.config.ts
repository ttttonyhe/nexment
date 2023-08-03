import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

export default defineConfig({
	build: {
		minify: false,
		rollupOptions: {
			input: {
				main: "./index.html",
			},
		},
	},
	plugins: [react()],
})
