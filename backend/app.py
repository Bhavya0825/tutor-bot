from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import logging
import re # <-- Import the regular expression module

# Configure logging to show up in Render's log stream
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# load_dotenv() is for local development and can be kept.
# Render will use its own environment variables in production.
load_dotenv()

# Tell Flask to look "up one directory" (../) and then into "frontend/dist"
app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

# ====================
# DEBUGGING ENDPOINT
# ====================
@app.route("/debug-env")
def debug_env():
    """A new endpoint to safely check if the API key is loaded."""
    key = os.getenv("OPENROUTER_API_KEY")
    if key and len(key) > 8:
        is_set = True
        key_preview = f"Key starts with '{key[:4]}' and ends with '{key[-4:]}'"
    elif key:
        is_set = True
        key_preview = "Key is set, but is very short. Is it correct?"
    else:
        is_set = False
        key_preview = "API Key is NOT FOUND by the application."

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
# /ask endpoint
# ====================
@app.route("/ask", methods=["POST"])
def ask():
    api_key_from_env = os.getenv("OPENROUTER_API_KEY")
    logging.info(f"Received request for /ask endpoint.")
    logging.info(f"Attempting to use API Key from environment.")

    try:
        data = request.get_json()
        question = data.get("question", "")
        topic = data.get("topic", "General")

        headers = {
            "Authorization": f"Bearer {api_key_from_env}",
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
        response.raise_for_status()
        answer = response.json()["choices"][0]["message"]["content"]

        return jsonify({"answer": answer})
    except Exception as e:
        logging.error(f"An error occurred in the /ask endpoint: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

# ====================
# /quiz/generate endpoint (CORRECTED AND MORE ROBUST)
# ====================
@app.route("/quiz/generate", methods=["POST"])
def generate_quiz():
    api_key_from_env = os.getenv("OPENROUTER_API_KEY")
    logging.info(f"Received request for /quiz/generate endpoint.")
    logging.info(f"Attempting to use API Key from environment.")

    try:
        data = request.get_json()
        topic = data.get("topic", "General")
        num_questions = int(data.get("num_questions", 5))

        # Improved prompt to insist on raw JSON output
        prompt = (
            f"Generate {num_questions} multiple-choice questions on the topic '{topic}'. "
            f"IMPORTANT: Respond with ONLY the raw JSON array, without any introductory text, comments, or markdown fences. "
            f"The required format is: "
            f"[{{\"question\": \"...\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correctAnswer\": \"B\"}}, ...]"
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
        
        logging.info(f"Raw AI response for quiz: {ai_text}")

        # Use regex to find the JSON array within the AI's response text
        match = re.search(r'\[.*\]', ai_text, re.DOTALL)
        
        if match:
            json_text = match.group(0)
            import json
            questions = json.loads(json_text)
            return jsonify({"questions": questions})
        else:
            # If no JSON array is found in the response, raise a clear error
            raise ValueError("AI response did not contain a valid JSON array.")

    except Exception as e:
        logging.error(f"An error occurred in the /quiz/generate endpoint: {e}", exc_info=True)
        error_message = f"Failed to parse quiz from AI response. Please try again. Error: {e}"
        return jsonify({"error": error_message}), 500

# ====================
# React Router fallback
# ====================
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")