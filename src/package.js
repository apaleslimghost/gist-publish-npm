const path = require('path');
const detective = require('detective');
const builtins = require('builtin-modules');
const HJSON = require('hjson');
const merge = require('lodash.merge');
const mapValues = require('lodash.mapvalues');
const values = require('lodash.values');
const promiseAllObject = require('@quarterto/promise-all-object');
const latestVersion = require('latest-version');

const actualPackageName = (req) => req.split('/', req[0] === '@' ? 2 : 1).join('/');

module.exports = async function({gistId, files, owner, history, description}) {
	const filenames = Object.keys(files);
	const fileContents = mapValues(files, ({content}) => content);
	const main = filenames.find(name => name.endsWith('.js'));

	const dependencies$ = promiseAllObject(values(fileContents)
		.reduce((deps, content) => Object.assign(
			deps,
			detective(content)
				.filter(p => !p.startsWith('.') && !builtins.includes(p))
				.map(actualPackageName)
				.reduce((obj, pack) => Object.assign(obj, {
					[pack]: latestVersion(pack).then(version => `^${version}`)
				}), {})
		), {})
	);

	return merge({
		main,
		version: `1.${history.length - 1}.0`,
		name: `@${owner.login}/${path.basename(main, '.js')}`,
		bin: fileContents[main].startsWith('#!/usr/bin/env node') && main,
		dependencies: await dependencies$,
		repository: `gist:${gistId}`,
		homepage: `https://gist.github.com/${gistId}`,

		// author:
	}, HJSON.parse(description));
};
