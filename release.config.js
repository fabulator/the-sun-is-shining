const { prepare } = require('semantic-release-config-fabulator');

module.exports = {
    extends: 'semantic-release-config-fabulator',
    verifyConditions: ['semantic-release-docker'],
    prepare: prepare.filter((value) => value !== '@semantic-release/npm' && value !== '@semantic-release/git'),
    publish: [/*'@semantic-release/github',*/ 'semantic-release-docker'],
    success: [],
    fail: [],
};
