import os
import requests
from dotenv import load_dotenv

load_dotenv()  # Load .env file to get API key

API_KEY = os.getenv("OPENROUTER_API_KEY")

if not API_KEY:
    print("ERROR: OPENROUTER_API_KEY not found in .env")
    exit(1)

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

try:
    response = requests.get("https://openrouter.ai/api/v1/models", headers=headers)
    response.raise_for_status()  # Raise error if any
    models = response.json()
    print("Available models:")
    for model in models.get("models", []):
        print(model["id"])  # Print the model id
except Exception as e:
    print("Error fetching models:", e)
