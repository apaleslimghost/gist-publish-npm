const clone = require('./clone.js');
const infer = require('./package.js');
const {promisifyAll} = require('bluebird');
const fs = require('mz/fs');
const temp = require('tmp-promise');
const publ = require('./publish.js');
const defaults = require('lodash.defaults');

const defaultConfig = {
	access: 'public'
};

module.exports = async function(id, config = {}) {
	const {path: dir} = await tmp.dir(id);
	const repo = await clone(id, dir);
	const pack = await infer(id, dir, repo);
	await fs.writeFileAsync(`${dir}/package.json`, JSON.stringify(pack), 'utf8');
	await publ(defaults(defaultConfig, config), dir);
	return pack;
};
