const { prepare } = require('semantic-release-config-fabulator');

const dockerPackage = `fabulator/${process.env.npm_package_name}:${nextRelease.version}`;

module.exports = {
    extends: 'semantic-release-config-fabulator',
    verifyConditions: ['semantic-release-docker'],
    prepare: [
        ...prepare.filter((value) => value !== '@semantic-release/npm' && value !== '@semantic-release/git'),
        {
            path: '@semantic-release/exec',
            cmd: `docker build -t ${dockerPackage} .`,
        }
    ],
    publish: [
        //'@semantic-release/github',
        {
            path: 'semantic-release-docker',
            name: `${dockerPackage}`,
        },
    ],
    success: [],
    fail: [],
    ci: false,
};
