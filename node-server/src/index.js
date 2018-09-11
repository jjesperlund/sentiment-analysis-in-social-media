
var fs = require('fs');
var readline = require('readline');
var { google } = require('googleapis');
var OAuth2 = google.auth.OAuth2;

// const request = require('request');
const express = require('express');
const app = express();
var http = require('http').Server(app);

const fetchData = require('./DataFetch');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/google-apis-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'google-apis-nodejs-quickstart.json';


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
  fs.readFile(TOKEN_PATH, function(err, token) {
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
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
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

app.get('/', function(req, res) {
  //res.set('Content-Type', 'text/plain');
  res.type('html');
  res.statusCode = 200;
  res.write('<h2>Express server.</h2>');
  res.write('<p><b>Youtube videos by category</b> <br/> /youtube-videos?category=X&count=X</p>');
  res.write('<p><b>Youtube comments by video ID</b> <br/> /youtube-comments?videoID=X&count=X</p>');
  res.write('<p><b>Tweets by category</b> <br/> /tweets?category=X</p>');
  res.send();
});

// Requested from client as /api/youtube-videos?category=<CATEGORY>&count=<COUNT>
app.get('/api/youtube-videos', function(req, res) {

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
  fs.readFile('../assets/client_secret_david.json', function processClientSecrets(err, content) {
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

// Requested from client as /api/youtube-comments?videoID=<VIDEO ID>&count=<COUNT>
app.get('/api/youtube-comments', function(req, res) {

  const videoID = req.query.videoID;
  const numberOfComments = req.query.count;

  // Send error if required params not defined
  if (!videoID || !numberOfComments) {
    res.statusCode = 403;
    res.type('text');
    res.send('Error 403: Required parameters not defined.')
  }

  console.log('Request detected: Youtube comments by video ID:', videoID);
  console.log('Fetching', numberOfComments, 'comments..');

  // Load client secrets from a local file.
  fs.readFile('../assets/client_secret.json', function processClientSecrets(err, content) {
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
