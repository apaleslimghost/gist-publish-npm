const github = require('gh-got');
const npmPublishProgrammatically = require('npm-publish-programmatically');
const mapValues = require('lodash.mapvalues');
const log = require('./logger');
const chalk = require('chalk');
const clipboard = require('clipboardy');
const inferPackage = require('./package');
const buble = require('buble');

async function publish(gistId, {npmToken}) {
	log.start(`${chalk.grey('fetching')} ${chalk.cyan.italic(`gist.github.com/${gistId}`)}`);
	const {body: {files, owner, history, description}} = await github(`gists/${gistId}`);

	const pack = await inferPackage({gistId, description, files, owner, history});
	const spec = `${pack.name}@${pack.version}`;

	log.message(`${chalk.grey('about to publish')} ${spec}`);

	const content = Object.assign(
		mapValues(files, ({content}, name) => {
			if(name.match(/\.jsx?$/)) {
				return buble.transform(content).code;
			}

			return content;
		}),
		{'package.json': pack}
	);

	await npmPublishProgrammatically(content, {auth: npmToken});

	log.success(`${chalk.grey('published')} ${spec}`);

	try {
		await clipboard.write(spec);
		log.clipboard('copied to clipboard');
	} catch(e) {}
}

module.exports = publish;
