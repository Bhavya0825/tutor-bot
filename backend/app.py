from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

# Keep your /ask and /quiz/generate routes below this...

@app.route("/ask", methods=["POST"])
def ask():
    # your existing code...
    pass

@app.route("/quiz/generate", methods=["POST"])
def generate_quiz():
    # your existing code...
    pass

# Optional: catch-all route for React Router
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")
