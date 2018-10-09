var fs = require('fs');
var readline = require('readline');
var {
  google
} = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var Twitter = require('twitter');
const express = require('express');
const app = express();
var http = require('http').Server(app);

// Local imports
const fetchData = require('./DataFetch');
const env_variables = require('../assets/environment-variables');

// Set up twitter client to access twitter API endpoints
var client = new Twitter({
  consumer_key: env_variables.consumer_key,
  consumer_secret: env_variables.consumer_secret,
  access_token_key: env_variables.access_token_key,
  access_token_secret: env_variables.access_token_secret
});

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/google-apis-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'google-apis-nodejs-quickstart.json';
console.log(TOKEN_PATH)

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, requestData, callback, res) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  // var auth = new googleAuth();
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      getNewToken(oauth2Client, requestData, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, requestData, res);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, requestData, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function (code) {
    rl.close();
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client, requestData);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Create a JSON object, representing an API resource, from a list of
 * properties and their values.
 *
 * @param {Object} properties A list of key-value pairs representing resource
 *                            properties and their values.
 * @return {Object} A JSON object. The function nests properties based on
 *                  periods (.) in property names.
 */
function createResource(properties) {
  var resource = {};
  var normalizedProps = properties;
  for (var p in properties) {
    var value = properties[p];
    if (p && p.substr(-2, 2) == '[]') {
      var adjustedName = p.replace('[]', '');
      if (value) {
        normalizedProps[adjustedName] = value.split(',');
      }
      delete normalizedProps[p];
    }
  }
  for (var p in normalizedProps) {
    // Leave properties that don't have values out of inserted resource.
    if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
      var propArray = p.split('.');
      var ref = resource;
      for (var pa = 0; pa < propArray.length; pa++) {
        var key = propArray[pa];
        if (pa == propArray.length - 1) {
          ref[key] = normalizedProps[p];
        } else {
          ref = ref[key] = ref[key] || {};
        }
      }
    };
  }
  return resource;
}

app.get('/', function (req, res) {
  //res.set('Content-Type', 'text/plain');
  res.type('html');
  res.statusCode = 200;
  res.write('<h2>Express server.</h2>');
  res.write('<p><b>Youtube videos by category</b> <br/> /api/youtube-videos?category=X&count=X</p>');
  res.write('<p><b>Youtube comments by video ID</b> <br/> /api/youtube-comments?videoID=X&count=X</p>');
  res.write('<p><b>Reddit comments by keyword</b> <br/> /api/reddit-comments?category=X&count=X</p>');
  res.write('<p><b>Youtube comments by multiple ID</b> <br/> /api/youtube-multipleID?multipleID=X</p>');
  res.write('<p><b>Tweets by category</b> <br/> /api/tweets?category=X&count=X</p>');
  res.send();
});

// Requested from client as /api/reddit-comments?count=<COUNT>
app.get('/api/reddit-comments', function(req, res) {

  const category = req.query.category;
  const count = req.query.count;

  // Send error if required params not defined
  if (!category || !count) {
    res.statusCode = 403;
    res.type('text');
    res.send('Error 403: Required parameters not defined.')
  }

  console.log('Request detected: Reddit comments by keyword:', category);
  console.log('Fetching', count, 'reddit comments..');

  // Get reddit comments from reddit rest api
  client.get(
    'https://api.pushshift.io/reddit/search/comment/?q=' + category + '&limit=' + count,
    function(error, response) {
    if (error) throw error;

    let result = response.data.map((item) => ({
      socialMedia: "reddit",
      authorDisplayName: item.author,
      comment: item.body,
      timestamp: new Date(item.created_utc)
    }));

    //Send response to client
    res.type('json');
    res.statusCode = 200;
    res.send(result);

  });
});

// Requested from client as /api/youtube-videos?category=<CATEGORY>&count=<COUNT>
app.get('/api/youtube-videos', function (req, res) {

  const category = req.query.category;
  const numberOfVideos = req.query.count;

  // Send error if required params not defined
  if (!category || !numberOfVideos) {
    res.statusCode = 403;
    res.type('text');
    res.send('Error 403: Required parameters not defined.')
  }

  console.log('Request detected: Youtube videos by category', category);

  // Load client secrets from a local file.
  fs.readFile('../assets/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Data parameters to fetch data
    let requestParams = {
      'params': {
        'maxResults': numberOfVideos,
        'part': 'snippet',
        'q': category,
        'type': '',
        'kind': 'youtube#video'
      }
    };
    // Authorize a client with the loaded credentials, then call the YouTube API.
    //See full code sample for authorize() function code.
    authorize(JSON.parse(content), requestParams, fetchData.getVideosByKeyword, res);
  });
});

// Requested from client as /api/tweets?category=<HASH-TAG>&count=<COUNT>
app.get('/api/tweets', function (req, res) {

  const category = req.query.category;
  const numberOfTweets = req.query.count;

  // Send error if required params not defined
  if (!category || !numberOfTweets) {
    res.statusCode = 403;
    res.type('text');
    res.send('Error 403: Required parameters not defined.')
  }

  console.log('Request detected: Tweets by category:', category);
  console.log('Fetching', numberOfTweets, 'tweets..');

  // Get tweets from Twitter API Endpoint /tweets
  client.get(
    'https://api.twitter.com/1.1/search/tweets.json?q=%23' + category + '&lang=en&count=' + numberOfTweets + '&result_type=recent',
    function (error, tweets) {
      if (error) throw error;

      let result = tweets.statuses.map((item) => ({
        socialMedia: "twitter",
        authorDisplayName: item.user.name,
        authorProfileImageUrl: item.user.profile_image_url,
        tweetText: item.text,
        retweetCount: item.retweet_count,
        timestamp: new Date(item.created_at)
      }));

      //Send response to client
      res.type('json');
      res.statusCode = 200;
      res.send(result);

    });
});

// Requested from client as /api/youtube-multipleID?multipleID=<VIDEO IDs...>
app.get('/api/youtube-multipleID', function (req, res) {
  const multipleID = req.query.multipleID

  if (!multipleID) {
    res.statusCode = 403;
    res.type('text');
    res.send('Error 403: Required parameters not defined.')
  }

  console.log('Request detected: Youtube comments by multiple video IDs:', multipleID);

  // Load client secrets from a local file.
  fs.readFile('../assets/client_secret_david.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Data parameters to fetch data
    let requestParams = {
      'params': {
        'part': 'snippet,statistics',
        'id': multipleID
      }
    };
    // Authorize a client with the loaded credentials, then call the YouTube API.
    //See full code sample for authorize() function code.
    authorize(JSON.parse(content), requestParams, fetchData.getVideoListMultipleId, res);
  })
});


// Requested from client as /api/youtube-comments?videoID=<VIDEO ID>&count=<COUNT>
app.get('/api/youtube-comments', function (req, res) {

  const videoID = req.query.videoID;
  const numberOfComments = req.query.count;

  // Send error if required params not defined
  if (!videoID || !numberOfComments) {
    res.statusCode = 403;
    res.type('text');
    res.send('Error 403: Required parameters not defined.')
  }

  //console.log('Request detected: Youtube comments by video ID:', videoID);
  //console.log('Fetching', numberOfComments, 'comments..');

  // Load client secrets from a local file.
  fs.readFile('../assets/client_secret_david.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Data parameters to fetch data
    let requestParams = {
      'params': {
        'part': 'snippet,replies',
        'videoId': videoID,
        'maxResults': numberOfComments
      }
    };
    // Authorize a client with the loaded credentials, then call the YouTube API.
    //See full code sample for authorize() function code.
    authorize(JSON.parse(content), requestParams, fetchData.getCommentThreadsListByVideoId, res);
  });

});

http.listen(5100, function () {
  console.log('Listening on port 5100.');
})
