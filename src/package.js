var bluebird = require('bluebird');
var fs = bluebird.promisifyAll(require('fs'));
var path = require('path');

var infer = {
	main:
		(id, dir, repo) => fs.readdirAsync(dir).then(
		files => files.filter(file => file.endsWith('.js'))).then(
		jsFiles => jsFiles.length === 1 ? jsFiles[0] : 'index.js'
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
		main => main === 'index.js'?  getGistName(id)
          : /* otherwise */       path.basename(main, '.js')
	),

	author:
		(id, dir, repo) => repo.getBranchCommit('master').then(
		commit => commit.author()).then(
		author => `${author.name()} <${author.email()}>`
	)
};

var arraysToObj = (xs, ys) => xs.reduce((o, x, i) => (o[x] = ys[i], o), {});

module.exports = function(id, dir, repo) {
	var keys = Object.keys(infer);
	return bluebird.all(
		keys.map(k => infer[k](id, dir, repo))
	).then(
		(values) => arraysToObj(keys, values)
	);
};
