const {promisifyAll, promisify} = require('bluebird');
const origNpm = require('npm');

const npm = promisifyAll(origNpm);
const publish = (...a) => promisify(origNpm.commands.publish)(...a);
const install = (...a) => promisify(origNpm.commands.install)(...a);

module.exports = async function(config, dir) {
	const oldDir = process.cwd();
	process.chdir(dir);
	try {
		await npm.loadAsync(config);
		await install([]);
		return publish([dir])
	} finally {
		process.chdir(oldDir);
	}
};
