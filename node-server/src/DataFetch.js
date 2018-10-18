var {
  google
} = require('googleapis');

getVideosByKeyword = (auth, requestData, res) => {
  var service = google.youtube('v3');
  var parameters = removeEmptyParameters(requestData['params']);
  parameters['auth'] = auth;
  service.search.list(parameters, function (err, response) {
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
  service.commentThreads.list(parameters, function (err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }


    let result = response.data.items.map((item) => ({
      socialMedia: "youtube",
      authorDisplayName: item.snippet.topLevelComment.snippet.authorDisplayName,
      authorProfileImageUrl: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
      comment: item.snippet.topLevelComment.snippet.textOriginal,
      likeCount: item.snippet.topLevelComment.snippet.likeCount,
      timestamp: new Date(item.snippet.topLevelComment.snippet.publishedAt)
    }));

    res.type('json');
    res.statusCode = 200;
    res.send(result);
  });
}


getVideoListMultipleId = (auth, requestData, res) => {
  var service = google.youtube('v3');
  var parameters = removeEmptyParameters(requestData['params']);
  parameters['auth'] = auth;
  service.videos.list(parameters, function (err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }

    // Parse response, retrieve wanted props
    let result = [];
    response.data.items.forEach((item) => {
      // Add videos if videoId exists and if commentCount != None
      if (item.id && typeof item.statistics.commentCount !== "undefined") {
        result.push({
          title: item.snippet.title,
          videoId: item.id,
          channelId: item.snippet.channelId,
        });
      }
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
module.exports.getVideoListMultipleId = getVideoListMultipleId;