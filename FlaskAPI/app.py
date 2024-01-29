import statistics
import tensorflow as tf
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin
import pickle
import numpy as np
from tensorflow import keras
import joblib


from sklearn.preprocessing import MinMaxScaler

new_model = keras.models.load_model('final_ANN_model1.h5')
Neural_scaler = joblib.load('ANN_scaler.pkl')

#Initializing the flask app
app = Flask(__name__)
CORS(app)


#Route for prediction
@app.route('/predict',methods=['POST'])
@cross_origin()
def predict():

    content = request.get_json()

    int_features = [
        content['Age'],
        content['BMI'],
        content['Breast_Feeding'],
        content['Marital_Status'],
        content['Alcohol'],
        content['Smoking'],
        content['Breast_Cancer_History'],
        content['Age_at_first_period'],
        content['Menstrual_Cycle']
    ]


    final_features = Neural_scaler.transform(np.array(int_features).reshape(-1,9))

    raw_prediction = new_model.predict(final_features)[0][0]*100

    print(raw_prediction)

    return jsonify(raw_prediction)



if __name__ == "__main__":
    app.run(debug=True)