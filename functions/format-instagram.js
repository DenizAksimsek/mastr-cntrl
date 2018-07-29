const base64 = require('base64it');
const logger = require('bunyan');

exports.instagram = function instagram(micropubContent) {
    const layout = 'instagram';
    const category = 'Notes';
    const pubDate = micropubContent.properties.published[0];
    const syndication = micropubContent.properties.syndication[0];
    const title = micropubContent.properties.content[0].substring(0, 100);
    let content = '';
    let photo = '';
    let addrLat = '';
    let addrLong  = '';
    let tagArray = '';
    let tags = '';

    try {
        content = micropubContent.properties.content[0];
    } catch (e) {
        logger.info('No content skipping..');
    }
    try {
        photo = micropubContent.properties.photo[0];
    } catch (e) {
        logger.info('No photo skipping..');
    }
    try {
        addrLat = micropubContent.properties.location[0].properties.latitude[0];
    } catch (e) {
        logger.info('No lattitude link skipping..');
    }
    try {
        addrLong = micropubContent.properties.location[0].properties.longitude[0];
    } catch (e) {
        logger.info('No longitude link skipping..');
    }
    try {
        tagArray = micropubContent.properties.category[0];
        for (let i = 0; i < tagArray.length; i++) {
            tags += tagArray[i];
            tags += ' ';
        }
    } catch (e) {
        logger.info('No tags skipping');
    }

    const entry = `---
layout: "${layout}"
title: "${title}"
photo: "${photo}"
date: "${pubDate}"
meta: "${title}"
category: "${category}"
syndication: "${syndication}"
latitude: "${addrLat}"
longitude: "${addrLong}"
tags:  "${tags}"
twitterCard: false
---
${content}
`;
    logger.info('Instragram content: ' + entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
