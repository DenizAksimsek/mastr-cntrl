const logger = require(appRootDirectory + '/app/functions/bunyan');

exports.findContent = function findContent(micropubContent) {
    let content = '';

    // Debug
    logger.info('Micropub JSON: ' + JSON.stringify(micropubContent));

    // Sometimes Quill is sending JSON in different structures, depending upon including images.
    // Try each method to make sure we capture the data
    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info('No content micropubContent.content');
    }

        // TEST if this works for PPK services. I suspect it only applies to ownyourswarm
    // try {
    //     content = micropubContent.properties.content[0];
    // } catch (e) {
    //     logger.info('No content micropubContent.properties.content[0]');
    // }

    return content;
};
