from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

# ====================
# Serve React frontend
# ====================
@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

# ====================
# /ask endpoint
# ====================
@app.route("/ask", methods=["POST"])
def ask():
    print("OPENROUTER_API_KEY =", repr(OPENROUTER_API_KEY))
    try:
        data = request.get_json()
        question = data.get("question", "")
        topic = data.get("topic", "General")

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "mistralai/mistral-7b-instruct",  # or any other OpenRouter-supported model
            "messages": [
                {"role": "system", "content": f"You are an expert tutor in {topic}."},
                {"role": "user", "content": question}
            ]
        }

        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
        response.raise_for_status()
        answer = response.json()["choices"][0]["message"]["content"]

        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ====================
# /quiz/generate endpoint
# ====================
@app.route("/quiz/generate", methods=["POST"])
def generate_quiz():
    try:
        data = request.get_json()
        topic = data.get("topic", "General")
        num_questions = int(data.get("num_questions", 5))

        prompt = (
            f"Generate {num_questions} multiple-choice questions on the topic '{topic}' in JSON format like:\n"
            "[{{\"question\": \"...\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correctAnswer\": \"B\"}}, ...]"
        )

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "mistralai/mistral-7b-instruct",
            "messages": [
                {"role": "system", "content": "You are an expert in educational content generation."},
                {"role": "user", "content": prompt}
            ]
        }

        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
        response.raise_for_status()
        ai_text = response.json()["choices"][0]["message"]["content"]

        # Try parsing the AI's response safely
        import json
        questions = json.loads(ai_text)

        return jsonify({"questions": questions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ====================
# React Router fallback
# ====================
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")
