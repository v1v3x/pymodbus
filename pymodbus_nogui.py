# ==================== PYMODBUS (RTU/TCP) ====================

import csv
import time
import os
from datetime import datetime
from pymodbus.client import ModbusTcpClient, ModbusSerialClient

# ==================== CONFIGURATION ====================

# Choose Modbus Type: "tcp" for Ethernet, "rtu" for Serial
MODBUS_TYPE = "rtu"  # Change to "rtu" if using Serial (RS-485)

# Modbus TCP (Ethernet) Configuration
PLC_IP = "192.168.1.10"  # Change to your PLC's IP Address
PLC_PORT = 502           # Default Modbus TCP Port

# Modbus RTU (Serial) Configuration RS-485
SERIAL_PORT = "COM3"     # Windows: COM3, Linux: "/dev/ttyUSB0"
BAUDRATE = 9600          # Adjust based on PLC settings
PARITY = "O"             # None (N), Even (E), or Odd (O)
STOPBITS = 1
BYTESIZE = 8
TIMEOUT = 1

# Modbus Register Settings
REGISTER_ADDRESS = 0x6304  # Change based on PLC's register map
REGISTER_COUNT = 1   # Number of registers to read
UNIT_ID = 1          # Usually 1 for a single PLC

# CSV File Name
CSV_FILE = "plc_data.csv"

# Data Logging Interval (Seconds)
LOG_INTERVAL = 5  # Change to your desired logging frequency

# Max reconnection attempts
MAX_RECONNECT_ATTEMPTS = 3

# ==================== CONNECT TO PLC ====================

def connect_to_plc():
    """Connects to the PLC using either Modbus TCP or Modbus RTU."""
    try:
        if MODBUS_TYPE == "tcp":
            client = ModbusTcpClient(PLC_IP, port=PLC_PORT)
        else:
            # Updated for newer pymodbus versions
            client = ModbusSerialClient(
                port=SERIAL_PORT,
                baudrate=BAUDRATE,
                parity=PARITY,
                stopbits=STOPBITS,
                bytesize=BYTESIZE,
                timeout=TIMEOUT,
            )

        if client.connect():
            print(f"✅ Connected to PLC via Modbus {MODBUS_TYPE.upper()}")
            return client
        else:
            print("❌ Failed to connect to PLC")
            return None
            
    except Exception as e:
        print(f"❌ Exception while connecting to PLC: {str(e)}")
        return None

# ==================== READ DATA FROM PLC ====================

def read_plc_data(client):
    """Reads data from PLC coils."""
    try:
        response = client.read_coils(address=6304,count= 1)  # Read 1 coil at address 6304
        
        if response.isError():
            print(f"❌ Modbus Error: {response}")
            return None
        else:
            return response.bits  # ✅ Correct attribute for coils (True/False list)

    except Exception as e:
        print(f"❌ Exception while reading PLC: {str(e)}")
        return None


# ==================== SAVE DATA TO CSV ====================

def initialize_csv():
    """Creates a new CSV file with headers if it doesn't exist."""
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, mode="w", newline="") as file:
            writer = csv.writer(file)
            headers = ["Timestamp"] + [f"Register_{REGISTER_ADDRESS + i}" for i in range(REGISTER_COUNT)]
            writer.writerow(headers)
        print(f"✅ Created new CSV file: {CSV_FILE}")

def save_to_csv(data):
    """Saves PLC data to a CSV file with timestamps."""
    if data is None:
        print("⚠️ No data to save")
        return

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Open CSV in append mode
    with open(CSV_FILE, mode="a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([timestamp] + data)
    
    print(f"✅ Data logged at {timestamp}: {data}")

# ==================== MAIN LOOP ====================

def main():
    """Continuously reads and logs PLC data."""
    # Initialize CSV file with headers
    initialize_csv()
    
    # Connect to PLC
    client = connect_to_plc()
    if client is None:
        retry_count = 0
        while client is None and retry_count < MAX_RECONNECT_ATTEMPTS:
            print(f"Retrying connection ({retry_count + 1}/{MAX_RECONNECT_ATTEMPTS})...")
            time.sleep(5)  # Wait before retry
            retry_count += 1
            client = connect_to_plc()
            
        if client is None:
            print("Failed to connect after multiple attempts. Exiting.")
            return

    print("📡 Starting data logging... (Press CTRL+C to stop)")

    try:
        reconnect_count = 0
        while True:
            data = read_plc_data(client)
            
            # Handle connection loss during operation
            if data is None and reconnect_count < MAX_RECONNECT_ATTEMPTS:
                print(f"Connection may be lost. Attempting to reconnect ({reconnect_count + 1}/{MAX_RECONNECT_ATTEMPTS})...")
                client.close()
                time.sleep(2)
                client = connect_to_plc()
                reconnect_count += 1
                if client is None:
                    continue
            elif data is None:
                print("Too many failed read attempts. Exiting.")
                break
            else:
                reconnect_count = 0  # Reset counter on successful read
                
            save_to_csv(data)
            time.sleep(LOG_INTERVAL)  # Wait before next read

    except KeyboardInterrupt:
        print("\n🛑 Stopping data logging...")
    finally:
        if client is not None:
            client.close()
        print("Connection closed. Exiting.")

if __name__ == "__main__":
    main()