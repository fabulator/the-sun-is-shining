const execa = require('execa');

module.exports = async (pluginConfig, { nextRelease: { version, channel }, logger }) => {
    logger.log(`Pushing version ${pluginConfig.name}:${version} to docker hub`)

    const dockerChannel = channel === 'master' ? 'latest' : channel;

    execa('docker', ['tag', `${pluginConfig.name}:latest`, `${pluginConfig.name}:${version}`], { stdio: 'inherit' });
    if (channel !== 'latest') {
        execa('docker', ['tag', `${pluginConfig.name}:latest`, `${pluginConfig.name}:${channel}`], { stdio: 'inherit' });
    }

    execa('docker', ['push', `${pluginConfig.name}:${version}`], { stdio: 'inherit' });
    execa('docker', ['push', `${pluginConfig.name}:${dockerChannel}`], { stdio: 'inherit' });
};
