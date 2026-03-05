import type { Config } from "jest"

const config: Config = {
	testEnvironment: "jsdom",
	roots: ["<rootDir>/__tests__"],
	transform: {
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.json",
				diagnostics: false,
			},
		],
	},
	moduleNameMapper: {
		"\\.scss$": "identity-obj-proxy",
	},
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	testMatch: ["**/*.test.ts", "**/*.test.tsx"],
}

export default config
