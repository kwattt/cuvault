import pandas as pd
import unidecode
import string
import numpy as np
import spacy
from nltk.stem import SnowballStemmer
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, f1_score, hamming_loss
import ast
import spacy.cli
def transform_sources(sources):

    def extract_sources_from_string(s):
        #Incoming string:
        #{ fuentes: [Lipschutz, S. (1973). Teoría de conjuntos y temas afines. McGraw Hill. (Recomendado por UDG)] }
        #Expected output:
        #[Lipschutz, S. (1973). Teoría de conjuntos y temas afines. McGraw Hill. (Recomendado por UDG)]
        s = s.replace("{ fuentes: ", "").replace("}", "")
        return s

    sources_list = sources.apply(extract_sources_from_string)
    print(sources_list)
    return sources_list
class DataModel:
    def __init__(self, csv_path:string) -> None:
        self.data = pd.read_csv(csv_path)
        self.sources = transform_sources(self.data["sources"])

        #self.stemmer = SnowballStemmer('spanish')
        try:
            
            self.spanish_stopwords = set(stopwords.words('spanish'))
        except LookupError:
            import nltk
            nltk.download('stopwords')
            self.spanish_stopwords = set(stopwords.words('spanish'))
        try:
            self.lemmatizer = spacy.load('es_core_news_sm')
        except OSError:
            spacy.cli.download('es_core_news_sm')
            self.lemmatizer = spacy.load('es_core_news_sm')
        # Initialize vectorizers
        self.concept_vectorizer = TfidfVectorizer()
        self.definition_vectorizer = TfidfVectorizer()
        self.tag_vectorizer = TfidfVectorizer()
        self.tf_idf = TfidfVectorizer()
        
        self.concept_tfidf = None
        self.definition_tfidf = None
        self.tag_tfidf = None
        self.concept_csim = None
        self.definition_csim = None
        self.tag_csim = None
        self.combined_csim = None
        self.model = None
        self.tfidf_x_full = None

    def data_preprocess(self, text: list) -> list:

        def preprocess_string(s):
            s = unidecode.unidecode(s)
            s = ''.join(c for c in s if c not in string.punctuation and c not in string.digits)
            return ' '.join(s.split()).lower()

        # Process the texts in batches
        processed_texts = [preprocess_string(s) for s in text]
        lemmatized_texts = []

        # Disable unnecessary components and use nlp.pipe for batch processing
        for doc in self.lemmatizer.pipe(processed_texts, disable=["tagger", "parser", "ner"]):
            lemmatized_text = ' '.join([token.lemma_ for token in doc if token.text not in self.spanish_stopwords])
            lemmatized_texts.append(lemmatized_text)

        return lemmatized_texts
    
    def generate_tfidf_matrices(self):
        concepts = self.data_preprocess(self.data['concept'])
        definitions = self.data_preprocess(self.data['definition'])
        tags = self.data_preprocess(self.data['labels'])

        # Generate TF-IDF matrices
        self.concept_tfidf = self.concept_vectorizer.fit_transform(concepts)
        self.definition_tfidf = self.definition_vectorizer.fit_transform(definitions)
        self.tag_tfidf = self.tag_vectorizer.fit_transform(tags)
    
    def generate_cosine_sim_matrices(self):
        # Generate cosine similarity matrices
        self.concept_csim = cosine_similarity(self.concept_tfidf)
        self.definition_csim = cosine_similarity(self.definition_tfidf)
        self.tag_csim = cosine_similarity(self.tag_tfidf)

        # Combine the matrices for later use in search functionality
        self.combined_csim = (self.concept_csim + self.definition_csim + self.tag_csim) / 3
    
    def search(self, text:string, top_n:int = 5):
        # Preprocess the input text
        processed_text = self.data_preprocess([text])

        # Generate TF-IDF vectors for the input using the previously fit vectorizers
        concept_vector = self.concept_vectorizer.transform(processed_text)
        definition_vector = self.definition_vectorizer.transform(processed_text)
        tag_vector = self.tag_vectorizer.transform(processed_text)

        # Compute cosine similarity with the existing dataset
        concept_csim = cosine_similarity(concept_vector, self.concept_tfidf)
        definition_csim = cosine_similarity(definition_vector, self.definition_tfidf)
        tag_csim = cosine_similarity(tag_vector, self.tag_tfidf)
        combined_csim = (concept_csim + definition_csim + tag_csim)/3

        # Retrieve the top N most similar entries
        top_indices = np.argsort(combined_csim[0])[-top_n:]
        top_entries = self.data.iloc[top_indices].values.tolist()

        #get weights
        weights = combined_csim[0][top_indices]
        #print(weights)
        #add weights to top_entries
        for i in range(len(top_entries)):
            top_entries[i].append(weights[i])
        
        for i in range(len(top_entries)):
            #print(i, top_entries[i][3])
            top_entries[i][3] = self.sources[top_indices[i]]
            # [label1,label2]

        # transform the list of lists into a dictionary so that it can be converted to JSON
        top_entries = [{'concept': entry[0], 'definition': entry[1], 'labels': entry[2], "sources": entry[3], "weight": entry[4]} for entry in top_entries]



        return top_entries
    
    def train(self) -> tuple:
                # Combine 'Concepto' and 'Definición' for X and use 'Etiquetas' for y
        X_full = self.data_preprocess(self.data['concept'] + ' ' + self.data['definition'])
        y_full = self.data['labels']

        # Splitting the data into training and test sets
        X_train, X_test, y_train, y_test = train_test_split(X_full, y_full, test_size=0.5, random_state=42)

        #preprocess the data
        #X_train = self.data_preprocess(X_train)
        #X_test = self.data_preprocess(X_test)

        # Generate TF-IDF vectors for the training and test sets
        self.tfidf_x_full = self.tf_idf.fit_transform(X_full)
        tfidf_X_train = self.tf_idf.transform(X_train)
        tfidf_X_test = self.tf_idf.transform(X_test)


        # Compute cosine similarity matrices for train and test sets
        cosine_sim_train = cosine_similarity(tfidf_X_train, self.tfidf_x_full)
        cosine_sim_test = cosine_similarity(tfidf_X_test, self.tfidf_x_full)


        # Combine TF-IDF and cosine similarity matrices for training
        X_train_combined = np.hstack((tfidf_X_train.toarray(), cosine_sim_train))
        X_test_combined = np.hstack((tfidf_X_test.toarray(), cosine_sim_test))

        print(X_train_combined.shape)
        print(X_test_combined.shape)
        #print(y_train.shape)

        # Model training

        self.model = SVC(kernel='linear', C=1, random_state=42)
        self.model.fit(X_train_combined, y_train)

        # Model prediction and evaluation
        y_pred = self.model.predict(X_test_combined)
        accuracy = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, average='weighted')
        hamming = hamming_loss(y_test, y_pred)

        results = "Accuracy: " + str(accuracy) + "\nF1: " + str(f1) + "\n Hamming: " + str(hamming) + "\n"

        # test model

        return results
        
    def retrain(self, new_csv_path:string) -> None:
        pd = pd.read_csv(new_csv_path)
        self.data = pd
        self.generate_tfidf_matrices()
        self.generate_cosine_sim_matrices()
        self.train()
    def predict_label(self,concept:string, definition:string):
        x = self.data_preprocess([concept + ' ' + definition])

        tfidf_x = self.tf_idf.transform(x)
        cosine_sim = cosine_similarity(tfidf_x, self.tfidf_x_full)

        X_combined = np.hstack((tfidf_x.toarray(), cosine_sim))

        y_pred = self.model.predict(X_combined)
        #returns label
        print(y_pred[0])
        return y_pred[0]

if __name__ == '__main__':
    test = DataModel("dataset2.csv")
    #print shape of tfidf matrices
    test.generate_tfidf_matrices()
    test.generate_cosine_sim_matrices()
    print(test.concept_tfidf.shape)
    print(test.definition_tfidf.shape)
    print(test.tag_tfidf.shape)
    print(test.concept_csim.shape)
    print(test.definition_csim.shape)
    print(test.tag_csim.shape)
    print(test.combined_csim.shape)

    results = test.train()

    print(results)

    search_term = "Conjunto"
    results = test.search(search_term)
    print(results)