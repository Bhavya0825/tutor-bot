from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

# ====================
# /ask endpoint
# ====================
@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json()
        question = data.get("question", "")
        topic = data.get("topic", "General")

        # Dummy or test response
        answer = f"This is a sample AI answer for the question: '{question}' in topic: {topic}."

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

        # Dummy questions
        questions = []
        for i in range(num_questions):
            questions.append({
                "question": f"What is {topic} question {i+1}?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": "Option B"
            })

        return jsonify({"questions": questions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Optional: catch-all route for React Router
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")
