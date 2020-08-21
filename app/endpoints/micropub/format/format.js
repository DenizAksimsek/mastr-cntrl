const moment = require('moment')

const logger = require(appRootDirectory + '/app/logging/bunyan');
const functionPath = '/app/endpoints/micropub/process-data/';
const handleContent = require(appRootDirectory + functionPath + 'content');
const handleDateTime = require(appRootDirectory + functionPath + 'datetime');
const handleTags = require(appRootDirectory + functionPath + 'tags');
const handleTargets = require(appRootDirectory + functionPath + 'syndication-targets'); // This is untested. Also IndieNews isn't appearing.

// Entry to be moved in to a formatter function, and return the markdown. It needs to take inputs from all the functions outputs previously.

function ensureArray(x) {
	return x instanceof Array ? x : [x]
}

module.exports = function format(micropubContent) {
    logger.info('JSON received: ' + JSON.stringify(micropubContent));
    const frontmatter = `
date: ${moment(mp.date).toISOString()}
${mp.name && `name: ${mp.name}`}
${mp.category && `tags: [${ensureArray(mp.name).join(', ')}]`}
${mp['in-reply-to'] && `replyTo: ${mp['in-reply-to']}`}
${mp['like-of'] && `likeOf: ${mp['like-of']}`}
${mp.syndication && `syndication: [${ensureArray(mp.syndication).join(', ')}]`}
`.replace(/\n+/, '\n')

    const entry = `---${frontmatter}---

${mp.content}
`

    logger.info('Note formatter finished: ' + entry);
    return entry;
};
