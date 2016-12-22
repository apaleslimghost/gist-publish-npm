const clone = require('./clone.js');
const infer = require('./package.js');
const {promisifyAll} = require('bluebird');
const origFs = require('fs');
const origTemp = require('temp');
const publ = require('./publish.js');
const defaults = require('lodash.defaults');

const fs = promisifyAll(origFs);
const temp = promisifyAll(origTemp.track());

const defaultConfig = {
	access: 'public'
};

module.exports = async function(id, config = {}) {
	const dir = await temp.mkdirAsync(id);
	const repo = await clone(id, dir);
	const pack = await infer(id, dir, repo);
	await fs.writeFileAsync(`${dir}/package.json`, JSON.stringify(pack), 'utf8');
	await publ(defaults(defaultConfig, config), dir);
	return pack;
};
