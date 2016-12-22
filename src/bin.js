#!/usr/bin/env node

const minimist = require('minimist');
const publish = require('../lib/index.js');
const chalk = require('chalk');

const argv = minimist(process.argv.slice(2));

async function doPublish(id, options) {
	try {
		const pack = await publish(id, options);
		console.log(chalk.green('✔︎'), id + chalk.grey(' → ') + pack.name + ' ' + pack.version);
	} catch(err) {
		console.error(chalk.red('✘'), id + '\n\n' + chalk.grey(err.stack));
	}
}

Promise.all(argv._.map(id => doPublish(id, argv))).then(() => {});
