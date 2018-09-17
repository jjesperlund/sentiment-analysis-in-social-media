import csv
import nltk
import time
import re
import pickle
from nltk.classify import NaiveBayesClassifier
from functions import word_feature_vec, read_twitter1, read_twitter2, divide_by_polarity, processVec, clean_tweet
#nltk.download('punkt')
#nltk.download('stopwords')

def main():
    start = time.time()
    print('--- Reading and processing training data ---')
    #movie_vec = read_movie('dataset/training_movie.tsv')
    twitter_vec1 = read_twitter1('dataset/train.csv')
    twitter_vec2 = read_twitter2('dataset/training_twitter.csv')
    total_vec = twitter_vec1+twitter_vec2
    pos_vec =  divide_by_polarity(total_vec, 'positive')
    neg_vec =  divide_by_polarity(total_vec, 'negative')
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
    start = time.time()
    text_vec = read_twitter2('dataset/testing_twitter.csv')
    pos_vec =  divide_by_polarity(text_vec, 'positive')
    neg_vec =  divide_by_polarity(text_vec, 'negative')
    end = time.time()
    print('Reading test data took: %f seconds' % (end-start))

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
    print('\n--- Saving model to pickle ---')
    save_classifier = open("naivebayes.pickle", "wb")
    pickle.dump(classifier, save_classifier)
    save_classifier.close()

if __name__ == '__main__':
    main()