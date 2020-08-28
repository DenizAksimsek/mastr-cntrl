const fetch = require('node-fetch');
const logger = require(appRootDirectory + '/app/logging/bunyan');
const format = require(appRootDirectory + '/app/endpoints/micropub/format/format');
const githubApi = require(appRootDirectory + '/app/github/post-to-api');
const handleDateTime = require(appRootDirectory + '/app/endpoints/micropub/process-data/datetime');

exports.micropubPost = function micropubPost(req, res) {
    let serviceIdentifier = '';
    let fileName;
    let responseSlug;
    let responseLocation;
    let payload;
    let publishedDate;
    let micropubType;
    let fileLocation;
    let commitMessage;
    const micropubContent = req.body;
    const token = req.headers.authorization;
    const indieauth = 'https://tokens.indieauth.com/token';

    logger.info('json body ' + JSON.stringify(req.body)); //Log packages sent, for debug

    try {
        publishedDate = req.body.properties.published[0];
    } catch (e) {
        publishedDate = handleDateTime.formatfileNameDateTime();
    }

    //Format date time for naming file.
    const postFileNameDate = publishedDate.slice(0, 10).replace(/-/g, '');
    const postFileNameTime = publishedDate.slice(11, -8).replace(/:/g, '');
    const dateTime = postFileNameDate + 'T' + postFileNameTime;

    // Micropub Action (only fires if authentication passes)
    function micropubAction(json) {
        serviceIdentifier = json.client_id;
        logger.info('Service is: ' + serviceIdentifier);
        logger.info('Payload JSON: ' + JSON.stringify(micropubContent));

        payload = format(micropubContent);
        commitMessage = 'Entry created';
        fileLocation = 'entries'
        fileName = `${dateTime}.md`;
        responseLocation = `https://www.denizaksimsek.com/${dateTime}`;

        githubApi.publish(req, res, fileLocation, fileName, responseLocation, payload, commitMessage);
    }

    // Check indie authentication
    function indieAuthentication(response) {
        return response.json();
    }

    fetch(indieauth, {
        method : 'GET',
        headers : {
            'Accept' : 'application/json',
            'Authorization' : token
        }
    })
        .then(indieAuthentication)
        .then(micropubAction)
        .catch((err) => logger.error(err));
};
