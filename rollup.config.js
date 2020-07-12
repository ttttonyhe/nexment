import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import sass from 'rollup-plugin-sass';
import clear from 'rollup-plugin-clear'

import pkg from './package.json';

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.ts',
		output: {
			name: 'nexment',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			clear({
				// required, point out which directories should be clear.
				targets: ['dist'],
				// optional, whether clear the directores when rollup recompile on --watch mode.
				watch: true, // default: false
			}),
			sass({
				insert: true
			}),
			resolve(), // so Rollup can find `ms`
			commonjs(), // so Rollup can convert `ms` to an ES module
			typescript(), // so Rollup can convert TypeScript to JavaScript
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify 
	// `file` and `format` for each target)
	{
		input: 'src/main.ts',
		external: ['react'],
		plugins: [
			sass({
				insert: true
			}),
			typescript(), // so Rollup can convert TypeScript to JavaScript
		],
		output: [{
				file: pkg.main,
				format: 'cjs'
			},
			{
				file: pkg.module,
				format: 'es'
			}
		]
	}
];