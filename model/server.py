from flask import Flask, request, jsonify
from model.model import DataModel
app = Flask(__name__)
import pandas as pd

model = DataModel("dataset.csv") 
model.generate_tfidf_matrices()
model.generate_cosine_sim_matrices()
model.train()

@app.route('/train', methods=['POST'])
def train():
    # get the body of the request and convert it to a csv file
    data = request.get_data()
    # de-encode the bytes object to a string
    data = data.decode('utf-8')
    # write to modified_data2.csv
    with open('dataset2.csv', 'w',encoding="utf-8") as f:
        f.write(data)

    global model
    model = DataModel('dataset2.csv')
    model.generate_tfidf_matrices()
    model.generate_cosine_sim_matrices()
    model.train()
    return jsonify({'message': 'Model retrained successfully'})


@app.route('/search', methods=['GET'])
def search():
    global model
    search_term = request.args.get('query')
    results = model.search(search_term)
    print(results)
    return jsonify(results)

@app.route('/predict', methods=['GET'])
def predict():
    global model
    print("Called predict")
    concept = request.args.get('concept')
    definition = request.args.get('definition')
    results = model.predict_label(concept, definition)
    print(results)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)