/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as path from 'path';

import type { Configuration } from 'webpack';
import { type Argv, variables } from './variables';
import { fileName } from './utils/filename';
import { includePlugins } from './utils/include-plugins';

import { minimizer } from './minimizer';
import { rules } from './rules/index';
import { plugins } from './plugins/index';
import { externals } from './external/index';
import { devServer } from './dev-server';

export default (
	env: object,
	argv: Argv,
	dir = process.cwd(),
	onlyTS = false
): Configuration => {
	const vars = variables(argv, dir);

	const {
		ES,
		superDirname,
		dirname,
		mode,
		isTest,
		isProd,
		debug,
		fat,
		uglify,
		outputPath
	} = vars;

	const [pluginsEntries] = includePlugins(dir);

	console.info(
		`ES:${ES} Mode:${mode} Test:${isTest} Uglify:${uglify} Fat:${fat} GenerateTypes:${vars.generateTypes}`
	);

	return {
		cache: !isProd || {
			type: 'filesystem',
			idleTimeoutForInitialStore: 0,
			name: `jodit${ES}${mode}${uglify}${fat}`
		},
		mode,
		target: ['web', 'es5'],
		context: dir,

		stats: {
			colors: true
		},

		devtool: debug ? 'inline-source-map' : false,

		entry: {
			jodit: ['./src/index'],
			...(!fat ? pluginsEntries : {})
		},

		output: {
			path: outputPath,
			filename: fileName(vars)('[name]') + '.js',
			publicPath: '/build/',
			libraryTarget: 'umd'
		},

		snapshot: {
			managedPaths: []
		},

		watchOptions: {
			followSymlinks: true
		},

		resolve: {
			extensions: [
				'.js',
				'.ts',
				'.d.ts',
				'.json',
				'.less',
				'.css',
				'.svg'
			],
			alias: {
				jodit: path.resolve(superDirname, './src/'),
				'jodit-pro': path.resolve(dirname, './src/'),
				super: path.resolve(superDirname, './src/')
			},
			symlinks: false
		},

		optimization: {
			minimize: !debug && uglify,
			moduleIds: debug ? 'named' : false,
			concatenateModules: false,
			mangleExports: true,
			minimizer: minimizer.map(mnm => mnm(vars))
		},

		module: {
			rules: rules(vars)
		},

		plugins: plugins(vars),

		externals: externals(vars),

		devServer: devServer(vars)
	};
};
