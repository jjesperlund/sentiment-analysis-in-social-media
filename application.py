import requests
import json
import pickle
from flask import Flask, render_template
from functions import processVec, word_feature_vec, clean_tweet

app = Flask(__name__)

classifier_f = open("naivebayes.pickle", "rb")
classifier = pickle.load(classifier_f)
classifier_f.close()

def getProbabilityDist(comment):
    prob_dist = classifier.prob_classify(word_feature_vec(comment))
    return [prob_dist.prob('positive'), prob_dist.prob('negative')]

def retrieveYoutube(category):
    multipleID = ""
    get_youtube = requests.get('http://127.0.0.1:5100/api/youtube-videos?category='+category+'&count=10')
    response_json = get_youtube.json()
    for line in response_json:
        multipleID += line['videoId'] + ','
    multipleID = multipleID[:-1]

    get_youtube = requests.get('http://127.0.0.1:5100/api/youtube-multipleID?multipleID='+multipleID)
    response_json = get_youtube.json()
    json_vec = []
    for i in response_json:
        comments_response = requests.get('http://127.0.0.1:5100/api/youtube-comments?videoID='+i['videoId']+'&count=10')
        json_data = comments_response.json()
        for c in json_data:
            comment = processVec(c['comment'].lower())
            sentiment = classifier.classify(word_feature_vec(comment)) #pos eller neg
            c['sentiment'] = sentiment
            c['videoTitle'] = i['title']
            prob_dist = getProbabilityDist(comment)
            c['probability'] = prob_dist
            json_vec.append(c)

    return json_vec

def retrieveTwitter(category):
    get_twitter = requests.get('http://127.0.0.1:5100/api/tweets?category=' +category+'&count=100')
    response_json = get_twitter.json()
    #print(response_json)
    json_vec = []
    for json_obj in response_json:
        json_obj['comment'] = json_obj['tweetText']
        json_obj.pop('tweetText')
        tweet = clean_tweet(json_obj['comment'])
        sentiment = classifier.classify(word_feature_vec(tweet))
        json_obj['sentiment'] = sentiment
        prob_dist = getProbabilityDist(tweet)
        json_obj['probability'] = prob_dist
        json_vec.append(json_obj)
    
    return json_vec

@app.route("/")
def start():
    return render_template('start.html')

@app.route("/index")
def index():
    return render_template('index.html')

@app.route("/category=<category>")
def category_route(category):
    category_variable = category
    youtube_vec = retrieveYoutube(category_variable)
    twitter_vec = retrieveTwitter(category_variable)

    json_vec = twitter_vec+youtube_vec
    json_vec = json.dumps(json_vec)
    #with open('youtubeTwitter.json', 'w') as outfile:
     #   json_vec = json.dumps(json_vec)
      #  json_dat = json.loads(json_vec)
       # json.dump(json_dat, outfile)
    return json_vec
    

if __name__ == '__main__':
    app.run(debug=True)
