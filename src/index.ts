/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:README.md]]
 * @packageDocumentation
 * @module jodit
 */

import './styles/index.less';

import * as constants from './core/constants';

// JODIT-SECTION-START:POLYFILLS

if (
	typeof process !== 'undefined' &&
	constants.ES === 'es5' &&
	typeof window !== 'undefined'
) {
	require('./polyfills');
}

// JODIT-SECTION-END:POLYFILLS

import { Jodit as DefaultJodit } from './jodit';

import Languages from './languages';

import * as decorators from './core/decorators';
import * as Modules from './modules/';
import * as Icons from './styles/icons/';

import 'jodit/plugins/index';

import './styles/themes/dark.less';

// copy constants in Jodit
Object.keys(constants).forEach((key: string) => {
	(DefaultJodit as any)[key] = (constants as any)[key];
});

const esFilter = (key: string): boolean => key !== '__esModule';

// Icons
Object.keys(Icons)
	.filter(esFilter)
	.forEach((key: string) => {
		Modules.Icon.set(key.replace('_', '-'), (Icons as any)[key]);
	});

// Modules
Object.keys(Modules)
	.filter(esFilter)
	.forEach((key: string) => {
		// @ts-ignore
		DefaultJodit.modules[key] = Modules[key];
	});

// Decorators
Object.keys(decorators)
	.filter(esFilter)
	.forEach((key: string) => {
		// @ts-ignore
		DefaultJodit.decorators[key] = decorators[key];
	});

['Confirm', 'Alert', 'Prompt'].forEach((key: string) => {
	// @ts-ignore
	DefaultJodit[key] = Modules[key];
});

// Languages
Object.keys(Languages)
	.filter(esFilter)
	.forEach((key: string) => {
		DefaultJodit.lang[key] = (Languages as any)[key];
	});

export { DefaultJodit as Jodit };

export class CommitMode {}
