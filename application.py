import requests
import json
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/category=<category>")
def category_route(category):
    category_variable = category
    get = requests.get('http://127.0.0.1:5100/api/youtube-videos?category='+category_variable+'&count=3')
    response_json = get.json()
    comments = []
    for i in response_json:
        comments_response = requests.get('http://127.0.0.1:5100/api/youtube-comments?videoID='+i['videoId']+'&count=2')
        for c in comments_response:
            comments.append(c)
    return 'here we want to return an object of comments'

if __name__ == '__main__':
    app.run(debug=True)
