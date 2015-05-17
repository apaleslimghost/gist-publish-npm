var bluebird = require('bluebird');
var fs = bluebird.promisifyAll(require('fs'));
var path = require('path');
var detective = require('detective');

var infer = {
	main:
		(id, dir, repo) => fs.readdirAsync(dir).then(
		files => files.filter(file => file.endsWith('.js'))).then(
		jsFiles => jsFiles[0]
	),

	version:
		(id, dir, repo) => repo.getBranchCommit('master').then(
		master => new bluebird((resolve, reject) => {
			var history = master.history();
			history.on('end', resolve);
			history.on('error', reject);
			history.start();
		}).then(
		commits => `1.${commits.length - 1}.0`
	)),

	name:
		(id, dir, repo) => infer.main(id, dir, repo).then(
		main => path.basename(main, '.js')
	),

	author:
		(id, dir, repo) => repo.getBranchCommit('master').then(
		commit => commit.author()).then(
		author => `${author.name()} <${author.email()}>`
	),

	dependencies:
		(id, dir, repo) => infer.main(id, dir, repo).then(
		main => path.resolve(dir, main)).then(
		mainPath => fs.readFileAsync(mainPath, 'utf8').then(
		src => stars(detective(src).filter(dep => !dep.startsWith('.')))
	))
};

var stars = (deps) => arraysToObj(deps, arrayN(deps.length, '*'));
var arrayN = (n, x) => n <= 0? [] : [x].concat(arrayN(n - 1, x));
var arraysToObj = (xs, ys) => xs.reduce((o, x, i) => (o[x] = ys[i], o), {});

module.exports = function(id, dir, repo) {
	var keys = Object.keys(infer);
	return bluebird.all(
		keys.map(k => infer[k](id, dir, repo))
	).then(
		(values) => arraysToObj(keys, values)
	);
};
