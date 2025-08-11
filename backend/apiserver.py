from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Allow requests from any origin (good for dev, restrict in prod)

TEXT_FOLDER = "texts"
os.makedirs(TEXT_FOLDER, exist_ok=True)

@app.get("/")
def hello():
    return "hello guys"

# List all .txt files
@app.get("/files")
def list_files():
    files = [f for f in os.listdir(TEXT_FOLDER) if f.endswith(".txt")]
    return jsonify(files)

# Get file content
@app.get("/files/<filename>")
def get_file(filename):
    filepath = os.path.join(TEXT_FOLDER, filename)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            return jsonify({"content": f.read()})
    return jsonify({"error": "File not found"}), 404

# Save or create file
@app.post("/files")
def save_file():
    data = request.get_json()
    filename = data.get("filename", "").strip()
    content = data.get("content", "")

    if not filename:
        return jsonify({"error": "Filename required"}), 400
    if not filename.endswith(".txt"):
        filename += ".txt"

    filepath = os.path.join(TEXT_FOLDER, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    return jsonify({"message": f"{filename} saved successfully"})

# Delete a file
@app.delete("/files/<filename>")
def delete_file(filename):
    filepath = os.path.join(TEXT_FOLDER, filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        return jsonify({"message": f"{filename} deleted"})
    return jsonify({"error": "File not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=False, port=5000)
