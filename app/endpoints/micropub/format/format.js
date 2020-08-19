const logger = require(appRootDirectory + '/app/logging/bunyan');
const functionPath = '/app/endpoints/micropub/process-data/';
const handleContent = require(appRootDirectory + functionPath + 'content');
const handleDateTime = require(appRootDirectory + functionPath + 'datetime');
const handleTags = require(appRootDirectory + functionPath + 'tags');
const handleTargets = require(appRootDirectory + functionPath + 'syndication-targets'); // This is untested. Also IndieNews isn't appearing.

// Entry to be moved in to a formatter function, and return the markdown. It needs to take inputs from all the functions outputs previously.

module.exports = function format(micropubContent) {
    logger.info('JSON received: ' + JSON.stringify(micropubContent));

    const pubDate = handleDateTime.formatDateTime();
    const content = handleContent.formatContent(micropubContent);
    const tags = handleTags.formatTags(micropubContent);
    const targetArray = handleTargets.formatTargets(micropubContent);

    const entry = JSON.stringify({ date: pubDate, tags, content, syndication: targets })

    logger.info('Note formatter finished: ' + entry);
    return entry;
};
