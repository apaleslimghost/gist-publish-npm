var bluebird = require('bluebird');
var fs = bluebird.promisifyAll(require('fs'));
var path = require('path');

var inferMain =
	dir => fs.readdirAsync(dir).then(
	files => files.filter(file => file.endsWith('.js'))).then(
	jsFiles => jsFiles.length === 1 ? jsFiles[0] : 'index.js'
);

var inferVersion =
	repo => repo.getBranchCommit('master').then(
	master => new bluebird((resolve, reject) => {
		var history = master.history();
		history.on('end', resolve);
		history.on('error', reject);
		history.start();
	}).then(
	commits => `1.${commits.length - 1}.0`
));

var inferName = (id, main) => main === 'index.js'? getGistName(id)
                            : path.basename(main, '.js');

var getAuthor =
	repo => repo.getBranchCommit('master').then(
	commit => commit.author().then(
	author => `${author.name()} <${author.email()}>`
));

module.exports = function(id, dir, repo) {
	return bluebird.join(
		inferMain(dir),
		inferVersion(repo),
		getAuthor(repo),
		(main, version, author) => {
			return {main, version, author};
		}
	);
};
