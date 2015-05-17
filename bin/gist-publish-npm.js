#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var publish = require('../lib/index.js');
var chalk = require('chalk');

argv._.forEach(function(id) {
	return publish(id, argv).then(function(pack) {
		console.log(chalk.green('✔︎'), id + chalk.grey(' → ') + pack.name + ' ' + pack.version);
	}, function(err) {
		console.error(chalk.red('✘'), id + '\n\n' + chalk.grey(err.stack));
	});
});

