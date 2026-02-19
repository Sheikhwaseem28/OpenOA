from flask import Flask, request, jsonify
# from openoa import PlantData # Import OpenOA (will configure later)

app = Flask(__name__)

@app.route("/api/analyze", methods=["POST"])
def analyze():
    # Simulate processing time
    # In a real scenario with full OpenOA, we would process the file here.
    # For Vercel demo purposes (due to size limits), we return a comprehensive mock report.
    
    mock_report = {
        "summary": {
            "gross_aep": 45.2,
            "net_aep": 38.7,
            "availability": 0.965,
            "capacity_factor": 0.42,
            "wake_loss": 0.124,
            "electrical_loss": 0.018
        },
        "monthly_production": [
            {"month": "Jan", "energy": 4.2},
            {"month": "Feb", "energy": 3.8},
            {"month": "Mar", "energy": 4.5},
            {"month": "Apr", "energy": 3.9},
            {"month": "May", "energy": 3.2},
            {"month": "Jun", "energy": 2.8},
            {"month": "Jul", "energy": 2.5},
            {"month": "Aug", "energy": 2.3},
            {"month": "Sep", "energy": 2.9},
            {"month": "Oct", "energy": 3.6},
            {"month": "Nov", "energy": 4.0},
            {"month": "Dec", "energy": 4.4}
        ],
        "power_curve": [
            {"wind_speed": 0, "power": 0},
            {"wind_speed": 2, "power": 0},
            {"wind_speed": 4, "power": 150},
            {"wind_speed": 6, "power": 600},
            {"wind_speed": 8, "power": 1400},
            {"wind_speed": 10, "power": 2500},
            {"wind_speed": 12, "power": 3200},
            {"wind_speed": 14, "power": 3400},
            {"wind_speed": 16, "power": 3450},
            {"wind_speed": 18, "power": 3450},
            {"wind_speed": 20, "power": 3450},
            {"wind_speed": 25, "power": 3450}
        ],
        "status": "success",
        "message": "Analysis completed successfully (Demo Mode)"
    }
    
    return jsonify(mock_report)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "OpenOA Backend API is running"})

if __name__ == "__main__":
    app.run(debug=True, port=5328)
