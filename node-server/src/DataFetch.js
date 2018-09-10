var { google } = require('googleapis');

getVideosByKeyword = (auth, requestData, res) => {
  var service = google.youtube('v3');
  var parameters = removeEmptyParameters(requestData['params']);
  parameters['auth'] = auth;

  service.search.list(parameters, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }

    // Parse response, retrieve wanted props
    let result = [];
    response.data.items.forEach((item) => {
      // Only add item if videoId exists
      if (item.id.videoId) {
        result.push({
          title: item.snippet.title,
          videoId: item.id.videoId,
          channelId: item.snippet.channelId,
        });
      }
    });
    //console.log(videos);
    res.type('json');
    res.statusCode = 200;
    res.send(result);
  });

}

getCommentThreadsListByVideoId = (auth, requestData, res) => {
  var service = google.youtube('v3');
  var parameters = removeEmptyParameters(requestData['params']);
  parameters['auth'] = auth;

  service.commentThreads.list(parameters, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    const result = [];
    response.data.items.forEach((item) => {
      const comment = item.snippet.topLevelComment.snippet.textOriginal;
      result.push(comment);
  });
    res.type('json');
    res.statusCode = 200;
    res.send(result);
  });
}

/**
 * Remove parameters that do not have values.
 *
 * @param {Object} params A list of key-value pairs representing request
 *                        parameters and their values.
 * @return {Object} The params object minus parameters with no values set.
 */
removeEmptyParameters = (params) => {
  for (var p in params) {
    if (!params[p] || params[p] == 'undefined') {
      delete params[p];
    }
  }
  return params;
}

module.exports.getVideosByKeyword = getVideosByKeyword;
module.exports.getCommentThreadsListByVideoId = getCommentThreadsListByVideoId;