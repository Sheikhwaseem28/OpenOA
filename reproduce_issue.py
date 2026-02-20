import pandas as pd
import sys
import os

# Add api directory to path
sys.path.append(os.path.join(os.getcwd(), 'api'))

from index import process_wind_data

# Create dummy dataframe mimicking user upload
data = {
    'Time': pd.date_range(start='2020-01-01', periods=100, freq='H'),
    'Active Power (kW)': [100.0] * 100,
    'Wind Speed (m/s)': [10.0] * 100,
    'Turbine ID': ['T01'] * 100,
    'Temperature (C)': [25.0] * 100
}
df = pd.DataFrame(data)

print("Running process_wind_data...")
try:
    result = process_wind_data(df)
    print("Success!")
    print(result)
except Exception as e:
    print("Crashed!")
    import traceback
    traceback.print_exc()
