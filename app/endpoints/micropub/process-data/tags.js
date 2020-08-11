const logger = require(appRootDirectory + '/app/logging/bunyan');

/*
Check for Tags and add them or default to miscellaneous
*/
exports.formatTags = function formatTags(micropubContent) {
    let tags = '';
    let tagArray = '';
    const targetArray = micropubContent['mp-syndicate-to'];

    logger.info('Checking for tags');
    try {
        tagArray = micropubContent.category;
        if (tagArray instanceof String) tagArray = [tagArray];
        for (let i = 0; i < tagArray.length; i++) {
            tags += `\n- ${tagArray[i]}`;
            logger.info('Found tag ' + tagArray[i]);
        }
    } catch (e) {
        logger.info('No tags provided assigning miscellaneous');
        tags += '\n- ';
        tags += 'miscellaneous';
    }

    // If we are syndicating content, add a tag as well.
    try {
        if (targetArray.length > 0) {
            tags += '\n- ';
            tags += 'syndicated';
        }
    } catch (e) {
        logger.info('No syndication tag');
    }

    return tags;
};
