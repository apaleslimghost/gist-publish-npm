#!/usr/bin/env node

const minimist = require('minimist');
const getAuthToken = require('registry-auth-token');
const publish = require('./index');
const log = require('./logger');

const printError = e => {
	log.error(e.message || e.toString());
	if(e.stack) {
		log.errorLine(e.stack.replace(e.message, ''));
	}
};

async function publishAll(argv) {
	let errored = 0;

	try {
		const options = Object.assign({
			npmToken: getAuthToken(),
		}, argv);

		if(!options.npmToken) throw new Error('No npm token found in ~/.npmrc or from --npmToken');

		for(const id of argv._) {
			try {
				await publish(id, options);
			} catch(e) {
				errored += 1;
				printError(e);
			}

			console.log();
		}
	} catch(e) {
		errored += 1;
		printError(e);
	}

	if(errored) {
		process.exit(errored);
	}
}

publishAll(minimist(process.argv.slice(2)));
