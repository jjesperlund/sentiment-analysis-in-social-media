import csv
import nltk
import time
import re
import pickle
from nltk.stem import porter
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords

# Global variables
STOPWORDS = list(set(stopwords.words('english')))
STEMMER = porter.PorterStemmer()

# Convert words to feature vectors for nltk.NaiveBayesClassifier
def word_feature_vec(words):
    return dict([(word, True) for word in words])

# Divide vector depending on polarity
def divide_by_polarity(vec, polarity):
    output_vec = []
    for line in vec:
        if line[0] == polarity:
            output_vec.append(line[1])
    return output_vec

# Preprocess input vectors.
def processVec(line):
    proc_sentenced = []
    wordvec = word_tokenize(line)
    for w in wordvec:
        if w not in STOPWORDS:
            proc_sentenced.append(STEMMER.stem(w))
    return proc_sentenced

# Regular expression function to clean tweet.
def clean_tweet(tweet): 
    tweet = (re.sub(r"#[\w\d]*|@[.]?[\w\d]*[\'\w*]*|https?:\/\/\S+\b|\
             www\.(\w+\.)+\S*|[.,:;!?()$-/^]*", "", tweet).lower())

    tweet = re.sub(r"(.)\1\1{1,1}", "", tweet)
    tweet = (re.sub(r"($.)\1{1,}", "", tweet).split())  
    tweet = [STEMMER.stem(x) for x in tweet if
             x not in STOPWORDS and len(x) > 1]
    return tweet  

# Read twitter csv where polarity = '0' equals negative and polarity = '1' equals positive.
def read_twitter1(csv_file):
    text_vec = []
    with open(csv_file, buffering = 50000, encoding='latin-1') as csv_file:
        try:
            for line in csv_file:
                line = line.replace('"','')
                polarity = line.split(',')[1]
                #print(polarity)
                if polarity == '0':
                    polarity = 'negative'
                elif polarity == '1':
                    polarity = 'positive'
                else:
                    continue

                tweet = line.split(',')[-1]
                tweet = clean_tweet(tweet)
                output = [polarity,tweet]
                text_vec.append(output)
        except Exception as e:
            print(str(e))
    
    return text_vec

# Read twitter csv where polarity = '0' equals negative and polarity = '4' equals positive.
def read_twitter2(csv_file):
    text_vec = []
    with open(csv_file, buffering = 200000, encoding='latin-1') as csv_file:
        try:
            for line in csv_file:
                line = line.replace('"','')
                polarity = line.split(',')[0]
                if polarity == '0':
                    polarity = 'negative'
                elif polarity == '4':
                    polarity = 'positive'
                else:
                    continue

                tweet = line.split(',')[-1]
                tweet = clean_tweet(tweet)
                output = [polarity,tweet]
                text_vec.append(output)
        except Exception as e:
            print(str(e))
    
    return text_vec