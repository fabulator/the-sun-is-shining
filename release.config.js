const path = require('path');
const { prepare } = require('semantic-release-config-fabulator');

const dockerPackage = `fabulator/${process.env.npm_package_name}`;

module.exports = {
    extends: 'semantic-release-config-fabulator',
    verifyConditions: ['semantic-release-docker'],
    prepare: [
        //...prepare.filter((value) => value !== '@semantic-release/npm' && value !== '@semantic-release/git'),
        {
            path: '@semantic-release/exec',
            cmd: `docker build -t ${dockerPackage}:\${nextRelease.version} .`,
        }
    ],
    publish: [
        //'@semantic-release/github',
        {
            path: path.resolve(__dirname, './publish-docker.js'),
            name: `${dockerPackage}`,
        },
    ],
    success: [],
    fail: [],
    ci: false,
};
