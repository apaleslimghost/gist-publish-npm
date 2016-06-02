import {promisifyAll, promisify} from 'bluebird';
import origNpm from 'npm';

const npm = promisifyAll(origNpm);
const publish = (...a) => promisify(origNpm.commands.publish)(...a);
const install = (...a) => promisify(origNpm.commands.install)(...a);

module.exports = async function(config, dir) {
	await npm.loadAsync(config);
	await install([]);
	return publish([dir])
};
