from flask import Flask, jsonify
from get_models import scrape_ollama_models
import json, os

app = Flask(__name__)

@app.route('/get_models', methods=['GET'])
def get_models():
    try:
        with open(os.path.join(os.path.dirname(__file__), 'ollama-models.json'), 'r') as file:
            return jsonify(json.load(file))
    except FileNotFoundError:
        scrape_ollama_models()
        with open(os.path.join(os.path.dirname(__file__), 'ollama-models.json'), 'r') as file:
            return jsonify(json.load(file))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=11001)
