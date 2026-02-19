from flask import Flask, request, jsonify
# from openoa import PlantData # Import OpenOA (will configure later)

app = Flask(__name__)

@app.route("/api/analyze", methods=["POST"])
def analyze():
    # Placeholder for OpenOA analysis logic
    return jsonify({"message": "Analysis endpoint ready", "status": "success"})

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "OpenOA Backend API"})

if __name__ == "__main__":
    app.run(debug=True)
