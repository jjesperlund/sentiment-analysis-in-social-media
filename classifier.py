import csv
import nltk
import time
import re
from itertools import islice
#nltk.download('punkt')
#nltk.download('stopwords')
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.classify import NaiveBayesClassifier
from nltk.stem import porter

STOPWORDS = list(set(stopwords.words('english')))
STEMMER = porter.PorterStemmer()

def word_feature_vec(words):
    return dict([(word, True) for word in words])

def divide_by_sentiment(vec, sentiment):
    output_vec = []
    for line in vec:
        if line[0] == sentiment:
            output_vec.append(line[1])
    return output_vec

def processVec(line):
    proc_sentenced = []
    wordvec = word_tokenize(line)
    for w in wordvec:
        if w not in STOPWORDS:
            proc_sentenced.append(STEMMER.stem(w))
    return proc_sentenced

def clean_tweet(tweet): 
    # clean hashtags, twitter names, web addresses, puncuation
    tweet = (re.sub(r"#[\w\d]*|@[.]?[\w\d]*[\'\w*]*|https?:\/\/\S+\b|\
             www\.(\w+\.)+\S*|[.,:;!?()$-/^]*", "", tweet).lower())

    # strip repeated chars (extra vals)
    tweet = re.sub(r"(.)\1\1{1,1}", "", tweet)
    tweet = (re.sub(r"($.)\1{1,}", "", tweet).split())  
    tweet = [STEMMER.stem(x) for x in tweet if
             x not in STOPWORDS and len(x) > 1]
    return tweet  

def read_twitter(csv_file):
    text_vec = []
    with open(csv_file, buffering = 50000, encoding='latin-1') as f:
        try:
            for line in f:
                line = line.replace('"','')
                polarity = line.split(',')[1]
                #print(polarity)
                if polarity == '0':
                    polarity = 'negative'
                elif polarity == '1':
                    polarity = 'positive'

                tweet = line.split(',')[-1]
                tweet = clean_tweet(tweet)
                outline = [polarity,tweet]
                text_vec.append(outline)
        except Exception as e:
            print(str(e))
    
    return text_vec

def read_twitter2(csv_file):
    text_vec = []
    with open(csv_file, buffering = 200000, encoding='latin-1') as f:
        try:
            for line in f:
                line = line.replace('"','')
                polarity = line.split(',')[0]
                #print(polarity)
                if polarity == '0':
                    polarity = 'negative'
                elif polarity == '4':
                    polarity = 'positive'
                else:
                    continue

                tweet = line.split(',')[-1]
                tweet = clean_tweet(tweet)
                outline = [polarity,tweet]
                text_vec.append(outline)
        except Exception as e:
            print(str(e))
    
    return text_vec

def main():
    start = time.time()
    print('--- Reading and processing training data ---')
    text_vec = read_twitter2('dataset/training_twitter.csv')
    text_vec2 = read_twitter('dataset/train.csv')
    total_vec = text_vec+text_vec2
    pos_vec = divide_by_sentiment(total_vec, 'positive')
    neg_vec = divide_by_sentiment(total_vec, 'negative')
    print(len(pos_vec))
    print(len(neg_vec))
    end = time.time()
    print('Preprocessing training data took: %f seconds' % (end-start))
 
    print('\n--- Training data ---')
    start = time.time()
    pos_feats = [(word_feature_vec(f), 'positive') for f in pos_vec ]
    neg_feats = [(word_feature_vec(f), 'negative') for f in neg_vec ]
    trainfeats = pos_feats + neg_feats
    classifier = nltk.NaiveBayesClassifier.train(trainfeats)
    end = time.time()
    print('Training classifier took: %f seconds' % (end-start))
    
    print('\n--- Reading test data ---')
    text_vec = read_twitter2('dataset/testing_twitter.csv')
    pos_vec = divide_by_sentiment(text_vec, 'positive')
    neg_vec = divide_by_sentiment(text_vec, 'negative')

    print('\n--- Preprocessing test data ---')
    pos_feats = [(word_feature_vec(f), 'positive') for f in pos_vec ]
    neg_feats = [(word_feature_vec(f), 'negative') for f in neg_vec ]
    testFeats = pos_feats + neg_feats
    print("Classifier accuracy: ", nltk.classify.util.accuracy(classifier, testFeats))

    
    text_example = ["I hate terror", "Tesla is the fucking best", "Spotify is a sinking ship", "Stefan Lofven has very good communication skills", "Fucking hell I don't want another exam", "I haven't got my results from the exam yet...."]
    for line in text_example:
        line = line.lower()
        wordvec = processVec(line)
        print(line + " : " + classifier.classify(word_feature_vec(wordvec)))
    
    classifier.show_most_informative_features(50)

if __name__ == '__main__':
    main()