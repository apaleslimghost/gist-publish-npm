var fs = require('bluebird').promisifyAll(require('fs'));

var inferMain =
	dir => fs.readdirAsync(dir).then(
	files => files.filter(file => file.endsWith('.js'))).then(
	jsFiles => jsFiles.length === 1 ? jsFiles[0] : 'index.js').map(
	file => './' + file
);

module.exports = function(id, dir, repo) {
	return inferMain(dir).then(main => {
		return {main};
	});
};
