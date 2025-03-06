# Configuration settings for PyModbus Script

# ---------------------------------------
# Modbus Connection Settings
# ---------------------------------------
MODBUS_TYPE = "TCP"  # Change to "RTU" for Serial Modbus

# For Modbus TCP
TCP_IP = "192.168.1.100"  # Change to your Modbus server IP
TCP_PORT = 502  # Standard Modbus TCP port

# For Modbus RTU (Serial Communication)
SERIAL_PORT = "/dev/ttyUSB0"  # Change as per your system (e.g., "COM3" for Windows)
BAUDRATE = 9600  # Common baud rate for Modbus RTU
BYTESIZE = 8
PARITY = "N"  # Options: "N" (None), "E" (Even), "O" (Odd)
STOPBITS = 1
TIMEOUT = 3  # Timeout in seconds

# ---------------------------------------
# Register Settings
# ---------------------------------------
READ_REGISTERS = [0, 1, 2, 3]  # List of Modbus registers to read
WRITE_REGISTERS = {10: 100, 11: 200}  # Example: {Register: Value}

# ---------------------------------------
# Logging Settings
# ---------------------------------------
LOGGING_ENABLED = True  # Set to False to disable logging
LOG_FILE = "modbus.log"  # Log file name

# ---------------------------------------
# Debug Mode
# ---------------------------------------
DEBUG_MODE = False  # Set to True for more verbose debugging output
