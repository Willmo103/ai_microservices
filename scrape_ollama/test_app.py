import unittest
import requests
import os

class FlaskApiTest(unittest.TestCase):
    BASE_URL = "http://localhost:5000/get_models"

    def test_json_response(self):
        response = requests.get(self.BASE_URL)
        self.assertEqual(response.headers['Content-Type'], 'application/json')

    def test_json_exists(self):
        data_dir = os.path.join(os.path.dirname(__file__), 'ollama-models.json')
        self.assertTrue(os.path.exists(data_dir))

    def test_get_models(self):
        response = requests.get(self.BASE_URL)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_get_get_modes_creates_json(self):
        data_dir = os.path.join(os.path.dirname(__file__), 'ollama-models.json')
        os.remove(data_dir)
        response = requests.get(self.BASE_URL)
        self.assertTrue(os.path.exists(data_dir))


if __name__ == '__main__':
    unittest.main()
