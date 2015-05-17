var bluebird = require('bluebird');
var npm = bluebird.promisifyAll(require('npm'));
bluebird.promisifyAll(npm.commands);

module.exports = function(config, dir) {
	console.log('publish', config, dir);
	return bluebird.resolve();
	return npm.loadAsync(config).then(
		() => npm.commands.publish([dir])
	);
};
