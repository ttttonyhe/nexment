import { build } from "esbuild"
import { ESBUILD_CONFIG, terminateProcess } from "."

build({ ...ESBUILD_CONFIG })
	.finally(terminateProcess)
	.catch(terminateProcess)
