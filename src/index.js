var clone = require('./clone.js');
var infer = require('./package.js');
var blueb = require('bluebird');
var fs    = blueb.promisifyAll(require('fs'));
var temp  = blueb.promisifyAll(require('temp').track());
var publ  = require('./publish.js');

var conf  = require('./config.json');

module.exports =
	id => temp.mkdirAsync(id).then(
	dir => clone(id, dir).then(
	repo => infer(id, repo).then(
	pack => fs.writeFileAsync(
		`${dir}/package.json`,
		JSON.stringify(pack),
		'utf8'
	))).then(() => publ(config, dir)));

