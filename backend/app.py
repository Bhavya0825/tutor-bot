from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import logging # <--- ADD THIS

# Configure logging to show up in Render's log stream
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

load_dotenv()

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

# ====================
# NEW DEBUGGING ENDPOINT
# ====================
@app.route("/debug-env")
def debug_env():
    """A new endpoint to safely check if the API key is loaded."""
    key = os.getenv("OPENROUTER_API_KEY")
    if key and len(key) > 8:
        # Do not expose the full key! Show only its status and a few chars.
        is_set = True
        key_preview = f"Key starts with '{key[:4]}' and ends with '{key[-4:]}'"
    elif key:
        is_set = True
        key_preview = "Key is set, but is very short. Is it correct?"
    else:
        is_set = False
        key_preview = "API Key is NOT FOUND by the application."

    # Log this information to the server logs as well
    logging.info(f"[DEBUG] /debug-env called. Key status: {key_preview}")

    return jsonify({
        "api_key_is_set": is_set,
        "api_key_preview": key_preview
    })

# ====================
# Serve React frontend
# ====================
@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

# ====================
# /ask endpoint (Updated with better logging)
# ====================
@app.route("/ask", methods=["POST"])
def ask():
    # Use logging instead of print. This is more reliable.
    api_key_from_env = os.getenv("OPENROUTER_API_KEY")
    logging.info(f"Received request for /ask endpoint.")
    logging.info(f"Attempting to use API Key: {repr(api_key_from_env)}") # This will show if the key is None

    try:
        data = request.get_json()
        question = data.get("question", "")
        topic = data.get("topic", "General")

        headers = {
            "Authorization": f"Bearer {api_key_from_env}", # Use the variable we just logged
            "Content-Type": "application/json"
        }

        payload = {
            "model": "mistralai/mistral-7b-instruct",
            "messages": [
                {"role": "system", "content": f"You are an expert tutor in {topic}."},
                {"role": "user", "content": question}
            ]
        }

        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
        response.raise_for_status() # This will raise an exception for 4xx or 5xx errors
        answer = response.json()["choices"][0]["message"]["content"]

        return jsonify({"answer": answer})
    except Exception as e:
        # Log the full error to the server for debugging
        logging.error(f"An error occurred in the /ask endpoint: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

# ====================
# /quiz/generate endpoint (Updated with better logging)
# ====================
@app.route("/quiz/generate", methods=["POST"])
def generate_quiz():
    api_key_from_env = os.getenv("OPENROUTER_API_KEY")
    logging.info(f"Received request for /quiz/generate endpoint.")
    logging.info(f"Attempting to use API Key: {repr(api_key_from_env)}")

    try:
        data = request.get_json()
        topic = data.get("topic", "General")
        num_questions = int(data.get("num_questions", 5))

        prompt = (
            f"Generate {num_questions} multiple-choice questions on the topic '{topic}' in JSON format like:\n"
            "[{{\"question\": \"...\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correctAnswer\": \"B\"}}, ...]"
        )

        headers = {
            "Authorization": f"Bearer {api_key_from_env}",
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

        import json
        questions = json.loads(ai_text)

        return jsonify({"questions": questions})
    except Exception as e:
        logging.error(f"An error occurred in the /quiz/generate endpoint: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

# ====================
# React Router fallback
# ====================
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")