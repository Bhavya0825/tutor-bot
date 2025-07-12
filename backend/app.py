from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import os

# Serve the frontend from the 'dist' folder after Vite build
app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
CORS(app)

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    question = data.get("question", "")
    topic = data.get("topic", "General")

    # Replace this logic with actual LLM or Gemini response logic if needed
    return jsonify({"answer": f"You asked: '{question}' on topic '{topic}'"})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
