import type { BuildOptions } from "esbuild"
import { dtsPlugin } from "esbuild-plugin-d.ts"
import { sassPlugin } from "esbuild-sass-plugin"
import { dependencies } from "../package.json"

const ESBUILD_CONFIG_BASE = {
	outdir: "dist",
	bundle: true,
	minify: true,
	sourcemap: false,
}

export const ESBUILD_CONFIG: BuildOptions = {
	...ESBUILD_CONFIG_BASE,
	entryPoints: ["src/index.ts"],
	platform: "browser",
	metafile: true,
	format: "esm",
	external: Object.keys(dependencies),
	plugins: [
		sassPlugin({
			type: "style",
		}),
		dtsPlugin(),
	],
}

export const terminateProcess = (code: number = 0) => {
	process.exit(code)
}
