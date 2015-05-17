var {Clone} = require('nodegit');

var gistGitUrl = (id) => `http://gist.github.com/${id}.git`;

module.exports = (id, dir)=> Clone.clone(gistGitUrl(id), dir, {
	remoteCallbacks: {certificateCheck: () => true}
});
