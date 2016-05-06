import {promisifyAll, promisify} from 'bluebird';
import origNpm from 'npm';

const npm = promisifyAll(origNpm);
const publish = (...a) => promisify(origNpm.commands.publish)(...a);

module.exports = (config, dir) => npm.loadAsync(config).then(() => publish([dir]));
