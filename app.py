from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib  # For loading the model and vectorizer
import numpy as np
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained SVM phishing detection model and vectorizer
model = joblib.load("svm_phishing_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")  # Ensure you have this saved during training

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print("Received Data:", data)

        if 'message' not in data:
            return jsonify({"error": "Missing 'message' in request data"}), 400

        # Extract email content (subject + message for better classification)
        email_text = f"{data.get('subject', '')} {data['message']}"

        # Convert text into numerical features using the trained vectorizer
        features = vectorizer.transform([email_text])

        # Make prediction using SVM model
        phishing_result = model.predict(features)[0]  # Get the first prediction

        return jsonify({"phishing": int(phishing_result)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5001, debug=True)
