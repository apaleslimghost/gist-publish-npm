const symbolLogger = require('@quarterto/symbol-logger');
const chalk = require('chalk');

module.exports = symbolLogger({
	start: {
		format: 'blue',
		symbol: '⚙︎'
	},

	success: {
		format: 'green',
		symbol: '✔︎'
	},

	error: {
		format: 'red',
		symbol: '✘'
	},

	errorLine: {
		format: 'red',
		formatLine: 'grey',
		symbol: '│'
	},

	clipboard: {
		symbol: '⎘',
		format: 'cyan',
		formatLine: chalk.grey.italic,
	},

	message: '│',

	dependency: {
		symbol: '╞',
		format: 'cyan',
		formatLine: 'grey',
	},
});
