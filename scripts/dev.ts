import { context } from "esbuild"
import { ESBUILD_CONFIG, terminateProcess } from "."

const watch = async () => {
	const componentsCtx = await context({ ...ESBUILD_CONFIG })
	await componentsCtx.watch()
}

watch().catch(terminateProcess)
