#!/usr/bin/env node

import minimist from 'minimist';
import publish from '../lib/index.js';
import chalk from 'chalk';

const argv = minimist(process.argv.slice(2));

async function doPublish(id, options) {
	try {
		const pack = await publish(id, options);
		console.log(chalk.green('✔︎'), id + chalk.grey(' → ') + pack.name + ' ' + pack.version);
	} catch(err) {
		console.error(chalk.red('✘'), id + '\n\n' + chalk.grey(err.stack));
	}
}

argv._.forEach(id => doPublish(id, argv));
