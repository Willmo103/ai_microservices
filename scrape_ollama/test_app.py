import unittest
import requests

class FlaskApiTest(unittest.TestCase):
    BASE_URL = "http://localhost:5000/get_models"

    def test_get_models(self):
        response = requests.get(self.BASE_URL)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)  # assuming the endpoint returns a list of models

if __name__ == '__main__':
    unittest.main()
