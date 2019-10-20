const execa = require('execa');
const semver = require('semver');

module.exports = async ({ name }, { nextRelease: { version }, logger }) => {
    function publish(dockerVersion) {
        execa('docker', ['tag', `${name}:latest`, `${name}:${dockerVersion}`], { stdio: 'inherit' });
        execa('docker', ['push', `${name}:${dockerVersion}`], { stdio: 'inherit' });
    }

    logger.log(`Pushing version ${name}:${version} to docker hub`);

    const { major, minor, patch, prerelease } = semver(version);

    const isProdRelease = prerelease.length === 0;

    publish(version);

    if (isProdRelease) {
        publish(`${major}.${minor}`);
        publish(`${major}`);
        publish('latest');
        return;
    }

    const [ channel ] = prerelease;

    publish(channel);
    publish(`${major}.${minor}.${path}-${channel}`);
};
