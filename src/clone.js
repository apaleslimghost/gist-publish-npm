var {Clone} = require('nodegit');

var gistGitUrl = (id) => `https://gist.github.com/${id}.git`;

module.exports = (id, dir)=> Clone.clone(gistGitUrl(id), dir);
