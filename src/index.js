import clone from './clone.js';
import infer from './package.js';
import {promisifyAll} from 'bluebird';
import origFs from 'fs';
import origTemp from 'temp';
import publ from './publish.js';
import defaults from 'lodash.defaults';

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
