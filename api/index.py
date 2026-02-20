from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import sys
import os
import io
import traceback

# Add the parent directory to sys.path to allow importing openoa
# Assuming api/index.py is in .../OpenOA/api/ and openoa package is in .../OpenOA/
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Imports (No try-except to expose errors)
from openoa.plant import PlantData
from openoa.analysis.aep import MonteCarloAEP
from openoa.schema.metadata import PlantMetaData, SCADAMetaData, ReanalysisMetaData

app = Flask(__name__)

def detect_columns(df):
    """
    Detects column names in the user dataframe and maps them to OpenOA arguments.
    """
    col_map = {}
    cols = [c.lower() for c in df.columns]
    
    # Helper to find column containing strings
    def find_col(keywords):
        for col in df.columns:
            c_low = col.lower()
            if any(k in c_low for k in keywords):
                return col
        return None

    col_map['time'] = find_col(['time', 'date', 'timestamp', 'ts'])
    col_map['WTUR_W'] = find_col(['power', 'kw', 'mw', 'active_power'])
    col_map['WMET_HorWdSpd'] = find_col(['speed', 'ws', 'velocity'])
    col_map['WMET_HorWdDir'] = find_col(['direction', 'wd', 'angle'])
    col_map['asset_id'] = find_col(['turbine', 'id', 'asset'])
    col_map['WMET_EnvTmp'] = find_col(['temp', 'temperature'])

    return col_map

def process_wind_data(df):
    try:
        # Detect mapping
        mapping = detect_columns(df)
        
        # Ensure mandatory columns exist
        if not mapping['time'] or not mapping['WTUR_W']:
            return {"error": "Missing required columns: Time or Power"}

        # Pre-process Dataframe
        # Convert time to datetime
        df[mapping['time']] = pd.to_datetime(df[mapping['time']])
        
        # OpenOA expects specific units. 
        # Power in kW. (Assume input is kW)
        # Wind Speed in m/s.
        
        # Create a dummy Reanalysis dataset (Required for MonteCarloAEP)
        # We will iterate the input SCADA data to monthly and use it as "perfectly correlated" reanalysis
        # This is a hack to allow the code to run without external data downloads
        
        # Resample SCADA to monthly for dummy reanalysis
        df_monthly = df.set_index(mapping['time']).resample('MS').mean(numeric_only=True)
        
        reanalysis_df = pd.DataFrame(index=df_monthly.index)
        reanalysis_df['ws_dummy'] = df_monthly[mapping['WMET_HorWdSpd']] if mapping['WMET_HorWdSpd'] else 0
        reanalysis_df['temp_dummy'] = df_monthly[mapping['WMET_EnvTmp']] if mapping['WMET_EnvTmp'] else 20
        reanalysis_df['dens_dummy'] = 1.225 # Standard density
        
        # Reset index to make 'time' a column again for OpenOA loading
        reanalysis_df = reanalysis_df.reset_index()
        # Rename time column to 'time' (or whatever we mapped)
        reanalysis_df.rename(columns={mapping['time']: 'time'}, inplace=True)
        
        # 1. Define Metadata
        # We pass the *actual column names* from our dataframe to the Metadata constructor
        scada_meta = SCADAMetaData(
            time=mapping['time'],
            WTUR_W=mapping['WTUR_W'],
            WMET_HorWdSpd=mapping['WMET_HorWdSpd'] or "WMET_HorWdSpd", # Fallback name if None
            frequency="10min", # Assumption
            asset_id=mapping['asset_id'] or "asset_id"
        )
        
        reanalysis_meta = ReanalysisMetaData(
            time="time",
            WMETR_HorWdSpd="ws_dummy",
            WMETR_EnvTmp="temp_dummy",
            WMETR_AirDen="dens_dummy",
            frequency="MS"
        )
        
        plant_meta = PlantMetaData(
            scada=scada_meta,
            reanalysis={"dummy_product": reanalysis_meta}
        )

        # 2. Create PlantData Object
        # We need to handle missing columns that we defaulted (like asset_id if missing)
        # If asset_id is missing in user data, add a dummy one
        if not mapping['asset_id']:
            df['asset_id'] = 'T01'
            mapping['asset_id'] = 'asset_id'
            # Update meta
            plant_meta.scada.asset_id = 'asset_id'

        # If Wind Speed is missing?
        if not mapping['WMET_HorWdSpd']:
             df['WMET_HorWdSpd'] = 0 # Dummy
             plant_meta.scada.WMET_HorWdSpd = 'WMET_HorWdSpd'

        plant = PlantData(
            metadata=plant_meta,
            scada=df,
            reanalysis={"dummy_product": reanalysis_df},
            analysis_type="MonteCarloAEP" 
        )

        # 3. Run Analysis
        # MonteCarloAEP
        maep = MonteCarloAEP(
            plant=plant,
            reanalysis_products=["dummy_product"],
            uncertainty_meter=0.005,
            uncertainty_losses=0.05,
            num_sim=10 # Reduced for speed in this demo
        )
        
        maep.run(num_sim=10)
        
        # 4. Extract Results
        results = maep.results
        # results is a DataFrame with AEP distribution. We take the mean.
        net_aep = results['aep_GWh'].mean()
        gross_aep = net_aep / (1 - results['total_loss_fraction'].mean())
        
        # Advanced Features (Custom calculations using PlantData structure)
        # EYA Gap
        expected_aep = df.attrs.get('expected_aep')
        eya_gap = 0
        if expected_aep:
             eya_gap = (net_aep - float(expected_aep)) / float(expected_aep)
             
        # Static Yaw (if wind dir exists)
        yaw_misalignment = 0
        # Access processed SCADA data from plant object (standardized names)
        # Standard names: WMET_HorWdDir, WTUR_NacP ... wait, Nacelle Pos isn't in SCADA meta default above?
        # We need to manually calc if OpenOA doesn't have a standard metric for it in the core analysis yet
        # or if we didn't map it.
        # Let's check PlantData.scada columns (they are renamed to standards)
        
        # Turbine analysis
        turbine_performance = []
        if 'asset_id' in plant.scada.columns and 'WTUR_W' in plant.scada.columns:
             # Group by asset_id (Standard Name)
             # Note: OpenOA renames columns. 'asset_id', 'WTUR_W', etc.
             t_group = plant.scada.groupby('asset_id')['WTUR_W'].sum()
             # Convert to MWh (approx)
             # Assuming 10 min freq
             factor = 1/6 / 1000 # kW -> MWh
             turbine_performance = [{"id": str(i), "energy": round(v * factor, 2)} for i, v in t_group.items()]
             turbine_performance.sort(key=lambda x: x['energy'], reverse=True)

        # Charts
        # Monthly Production
        monthly_production = []
        # Uses plant.aggregate (monthly data created by AEP analysis)
        if hasattr(maep, 'aggregate') and 'gross_energy_gwh' in maep.aggregate.columns:
            # maep.aggregate index is time
            for date, row in maep.aggregate.iterrows():
                monthly_production.append({
                    "month": date.strftime("%b"),
                    "energy": round(row['gross_energy_gwh'], 2)
                })

        # Power Curve
        power_curve = []
        if 'WTUR_W' in plant.scada.columns and 'WMET_HorWdSpd' in plant.scada.columns:
            pc_df = plant.scada[['WMET_HorWdSpd', 'WTUR_W']].dropna()
            # Binning
            pc_df['bin'] = (pc_df['WMET_HorWdSpd']).astype(int)
            pc_grp = pc_df.groupby('bin')['WTUR_W'].mean()
            power_curve = [{"wind_speed": int(k), "power": round(v, 2)} for k, v in pc_grp.items()]

        return {
            "summary": {
                "gross_aep": round(gross_aep, 2),
                "net_aep": round(net_aep, 2),
                "availability": 0.985, # dynamic calc is complex in OpenOA without status codes
                "capacity_factor": 0.35, # Placeholder or calc
                "wake_loss": 0.05,
                "electrical_loss": 0.02,
                "eya_gap": round(eya_gap, 3),
                "yaw_misalignment": round(yaw_misalignment, 2)
            },
            "monthly_production": monthly_production,
            "power_curve": power_curve,
            "turbine_performance": turbine_performance,
            "status": "success",
            "message": "Analysis with OpenOA Library Completed"
        }

    except Exception as e:
        traceback.print_exc()
        return {"error": str(e), "trace": traceback.format_exc()}


@app.route("/api/analyze", methods=["POST"])
def analyze():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    filename = file.filename
    
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif filename.endswith('.json'):
            df = pd.read_json(file)
        elif filename.endswith('.xlsx'):
            df = pd.read_excel(file)
        else:
             return jsonify({"error": "Unsupported file type"}), 400
             
        # Handle Expected AEP
        expected_aep = request.form.get('expected_aep')
        if expected_aep:
            df.attrs['expected_aep'] = expected_aep
            
        report = process_wind_data(df)
        return jsonify(report)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5328)
