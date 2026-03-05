/** @type {import('jest').Config} */
module.exports = {
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
