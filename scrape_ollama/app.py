from flask import Flask, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route('/get_models', methods=['GET'])
def get_models():
    url = "https://ollama.ai/library"
    response = requests.get(url)
    if response.status_code != 200:
        return jsonify({"error": "Failed to retrieve the webpage"}), 500

    soup = BeautifulSoup(response.text, 'html.parser')
    models = soup.find_all('div', class_='model-entry')  # Adapt based on actual HTML structure

    model_list = []
    for model in models:
        # Extract model details, adapt these based on actual HTML structure
        model_list.append({
            'name': model.find('h2').text,
            'description': model.find('p').text,
            'pulls': model.find('span', class_='pulls').text,
            'tags': model.find('span', class_='tags').text,
            'last_updated': model.find('span', class_='updated-date').text
        })

    return jsonify(model_list)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=11001)
