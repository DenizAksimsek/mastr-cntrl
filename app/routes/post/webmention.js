const rp = require('request-promise');
const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const webmention = config.webmention;
const github = config.github;
const webhookKey = config.webmention.webhook;

exports.webmentionPost = function webmentionPost(req, res) {
    const messageContent = ':robot: Webmentions updated by Mastrl Cntrl';
    const postFileName = 'webmentions_test.json';
    const postDestination = github.postUrl + '/contents/_data/' + postFileName;
    const apiOptions = {
        uri : postDestination,
        headers : {
            Authorization : 'token ' + github.key,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
            'User-Agent' : github.name
        },
        json : true
    };

    let payload;
    let options;
    let currentWebmentions;
    let encodedContent;

    function isEmptyObject(obj) {
        return !Object.keys(obj).length;
    }

    function isEmptyObject(obj) {
        let key;

        for (key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }

    function handleGithubApiGet(err) {
        logger.info('Github API Get File Failed');
        logger.error(err);
        res.status(400);
        res.send('Internal Error Please Contact Author');
    }

    function handlePatchError(err) {
        logger.info('Webmention update to Github API Failed');
        logger.error(err);
        res.status(400);
        res.send('Update failed');
    }

    function functionFinish() {
        logger.info('Webmentions complete');
        res.status(202);
        res.send('Accepted');
    }

    //https://gist.github.com/dougalcampbell/2024272
    function strencode(data) {
        return unescape(encodeURIComponent(JSON.stringify(data)));
    }

    //https://gist.github.com/dougalcampbell/2024272
    function strdecode(data) {
        return JSON.parse(decodeURIComponent(escape(data)));
    }

logger.info(req.body);

    if (req.body.secret ===  webhookKey) {
        logger.info('Webmentions recieved');
        const webmentionsToAdd = req.body.post;
        logger.info('webmentions to add ' + strencode(webmentionsToAdd));

        rp(apiOptions)
        .then((repos) => {
            currentWebmentions = base64.decode(repos.content);

            const currentWebmentionsParsed = strdecode(currentWebmentions);
                currentWebmentionsParsed['links'].push(webmentionsToAdd);

                // Prepare the code to send to Github API
                payload = strencode(currentWebmentionsParsed);
                logger.info('payload combined');

                //Base 64 Encode for Github API
                encodedContent = base64.encode(payload);
                logger.info('payload encoded');

                options = {
                    method : 'PUT',
                    uri : postDestination,
                    headers : {
                        Authorization : 'token ' + github.key,
                        'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
                        'User-Agent' : github.name
                    },
                    body : {
                        path : postFileName,
                        branch : github.branch,
                        message : messageContent,
                        sha : repos.sha,
                        committer : {
                            'name' : github.user,
                            'email' : github.email
                        },
                        content : encodedContent
                    },
                    json : true
                };

                rp(options)
                .then(functionFinish)
                .catch(handlePatchError);
            })
        .catch(handleGithubApiGet);

    } else {
        res.status(400);
        res.send('Secret incorrect');
    }
return;
};
