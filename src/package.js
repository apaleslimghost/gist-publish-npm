import Promise, {promisifyAll} from 'bluebird';
import origFs from 'fs';
import path from 'path';
import detective from 'detective';
import fetch from 'node-fetch';
import builtins from 'builtin-modules';
import HJSON from 'hjson';
import merge from 'lodash.merge';
import promiseAllObject from '@quarterto/promise-all-object';
import mapValues from 'lodash.mapvalues';
import {transform} from 'babel-core';

const fs = promisifyAll(origFs);

async function jsonOrThrowError(response) {
	const json = await response.json();
	if(response.ok) {
		return json;
	} else {
		throw new Error(json.message || r.statusText);
	}
}

const getGist = id => fetch(`https://api.github.com/gists/${id}`).then(jsonOrThrowError);

const infer = {
	async main(id, dir, repo) {
		const files = await fs.readdirAsync(dir);
		const jsfiles = files.filter(file => file.endsWith('.js'));
		return jsfiles[0];
	},

	async version(id, dir, repo) {
		const master = await repo.getBranchCommit('master');
		const commits = await new Promise((resolve, reject) => {
			const history = master.history();
			history.on('end', resolve);
			history.on('error', reject);
			history.start();
		});
		return `1.${commits.length - 1}.0`;
	},

	async name(id, dir, repo) {
		const main = await infer.main(id, dir, repo);
		const name = path.basename(main, '.js');
		const gist = await getGist(id);
		return `@${gist.owner.login}/${name}`;
	},

	async author(id, dir, repo) {
		const commit = await repo.getBranchCommit('master');
		const author = await commit.author();
		return `${author.name()} <${author.email()}>`;
	},

	async bin(id, dir, repo) {
		const main = await infer.main(id, dir, repo);
		const src = await fs.readFileAsync(path.resolve(dir, main), 'utf8');
		const firstLine = src.split('\n')[0];
		if(firstLine === '#!/usr/bin/env node') {
			return main;
		}
	},

	async dependencies(id, dir, repo) {
		const mainPath = path.resolve(dir, await infer.main(id, dir, repo));
		const src = await fs.readFileAsync(mainPath, 'utf8');
		const transformed = transform(src, {
			plugins: 'transform-es2015-modules-commonjs'
		});
		const packages = detective(transformed);
		return stars(
			packages
			.filter(
				p => p.indexOf('.') !== 0 && builtins.indexOf(p) === -1
			)
			.map(actualPackageName)
		);
	},

	repository(id, dir, repo) {
		return `gist:${id}`;
	},

	homepage(id, dir, repo) {
		return `https://gist.github.com/${id}`;
	},

	devDependencies() {
		return {
			'babel-cli': '^6.0.0',
			'babel-preset-es2015': '^6.0.0',
		};
	},

	babel() {
		return {
			presets: ['es2015']
		};
	},

	async scripts(id, dir, repo) {
		const main = await infer.main(id, dir, repo);
		const orig = path.resolve(dir, `_${main}`);
		const compiled = path.resolve(dir, main);

		return {
			prepublish: `mv ${compiled} ${orig} ; babel ${orig} -o ${compiled}`
		};
	}
};

const actualPackageName = (req) => req.split('/', req[0] === '@' ? 2 : 1).join('/');
const stars = (deps) => arraysToObj(deps, arrayN(deps.length, '*')); //yolo
const arrayN = (n, x) => n <= 0? [] : [x].concat(arrayN(n - 1, x));
const arraysToObj = (xs, ys) => xs.reduce((o, x, i) => (o[x] = ys[i], o), {});

async function getExtraMetadata(id) {
	const {description} = await getGist(id);
	return HJSON.parse(description);
};

module.exports = async function(id, dir, repo) {
	const base = await promiseAllObject(mapValues(infer, part => part(id, dir, repo)));
	const extra = await getExtraMetadata(id);
	return merge(base, extra);
};
