from flask_cors import CORS
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "TutorIQ Backend Running!"

# Your other routes...

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
