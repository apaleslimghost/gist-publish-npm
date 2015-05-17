var bluebird = require('bluebird');
var npm = bluebird.promisifyAll(require('npm'));
var publish = (...a) => bluebird.promisify(npm.commands.publish)(...a);

module.exports = function(config, dir) {
	return npm.loadAsync(config).then(() => publish([dir]));
};
