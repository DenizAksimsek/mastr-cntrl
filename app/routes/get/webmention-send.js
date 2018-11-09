const fetch = require('node-fetch');
const rp = require('request-promise');
const base64 = require('base64it');
const moment = require('moment');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
const webmention = config.webmention; // Need Telepgraph Key
const currentTime  =  moment().format('YYYY-MM-DDTHH:mm:ss');

// Get from https://vincentp.me/feeds/indieweb/webmentions.json
// Post date back to https://github.com/vipickering/vincentp/blob/master/_data/published.yml

exports.webmentionSend = function webmentionSend(req, res) {
    const messageContent = ':robot: webmentions last sent date updated by Mastrl Cntrl';
    const webmentionsDateFileName = 'published.yml';
    const webmentionsDateFileDestination = github.postUrl + '/contents/_data/' + webmentionsDateFileName;
    const githubApIFileOptions = {
        uri : webmentionsDateFileDestination,
        headers : {
            Authorization : 'token ' + github.key,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
            'User-Agent' : github.name
        },
        json : true
    };
    let payload;
    let options;
    let publishedTime;
    let encodedContent;

    // function isEmptyObject(obj) {
    //     return !Object.keys(obj).length;
    // }

    // function isEmptyObject(obj) {
    //     let key;

    //     for (key in obj) {
    //         if (Object.prototype.hasOwnProperty.call(obj, key)) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }

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
        logger.info('Webmentions sent');
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

    logger.info(githubApIFileOptions);
    logger.info('Getting current webmention date ');

    // When pinged

    // 1. Get the JSON feed from live . If empty, proceed to 2
    //Otherwise loop through data and submit to Telegraph

    //CODE HERE.

    // 2. Get the date file from Github, update the date to current date. POST back.
    rp(githubApIFileOptions)
        .then((repos) => {
            //Get previous published time
            publishedTime = base64.decode(repos.content);
            logger.info('old publish time: ' + publishedTime);

            // reassign published time with current time
            publishedTime = 'time: ' + currentTime;
            logger.info('current publish time: ' + publishedTime);

            // Prepare the code to send to Github API
            payload = strencode(publishedTime);
            logger.info('payload created');

            //Base 64 Encode for Github API
            encodedContent = base64.encode(payload);
            logger.info('payload encoded');

            //Configure options to PUT file back in Github API
            options = {
                method : 'PUT',
                uri : webmentionsDateFileDestination,
                headers : {
                    Authorization : 'token ' + github.key,
                    'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
                    'User-Agent' : github.name
                },
                body : {
                    path : webmentionsDateFileName,
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
            //Push file in to Github API.
            rp(options)
                .then(functionFinish)
                .catch(handlePatchError);
        })
        .catch(handleGithubApiGet);

    // logger.info('success!');
    // res.status(200);
    // res.send('Done');
};
