from flask import Flask, jsonify
from flask_cors import CORS
import aws_controller

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "This is the main page."
    
@app.route('/get-items')
def get_items():
    return jsonify(aws_controller.get_items())


if __name__ == '__main__':
    app.run()

