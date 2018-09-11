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
    get = requests.get('http://localhost:5100/api/youtube-videos?category='+category_variable+'&count=3')
    print(get.text)
    return 'GG'


if __name__ == '__main__':
    app.run(debug=True)
