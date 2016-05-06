import {Clone} from 'nodegit';

const gistGitUrl = (id) => `http://gist.github.com/${id}.git`;

module.exports = (id, dir) => Clone.clone(gistGitUrl(id), dir, {
	remoteCallbacks: {certificateCheck: () => true}
});
