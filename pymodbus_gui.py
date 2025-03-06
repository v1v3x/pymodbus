import csv
import time
import os
import threading
import tkinter as tk
from tkinter import ttk, scrolledtext, filedialog, messagebox
from datetime import datetime
from pymodbus.client import ModbusTcpClient, ModbusSerialClient

class ModbusLoggerUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Modbus Data Logger")
        self.root.geometry("800x600")
        self.root.minsize(800, 600)
        
        # Variables
        self.log_running = False
        self.log_thread = None
        self.client = None
        self.reconnect_count = 0
        self.max_reconnect_attempts = 3
        
        # Configuration variables
        self.modbus_type = tk.StringVar(value="rtu")
        self.plc_ip = tk.StringVar(value="192.168.1.10")
        self.plc_port = tk.IntVar(value=502)
        self.serial_port = tk.StringVar(value="COM3")
        self.baudrate = tk.IntVar(value=9600)
        self.parity = tk.StringVar(value="O")
        self.stopbits = tk.IntVar(value=1)
        self.bytesize = tk.IntVar(value=8)
        self.timeout = tk.IntVar(value=1)
        self.register_address = tk.StringVar(value="0x6304")
        self.register_count = tk.IntVar(value=1)
        self.unit_id = tk.IntVar(value=1)
        self.csv_file = tk.StringVar(value="plc_data.csv")
        self.log_interval = tk.IntVar(value=5)
        
        # Create UI
        self.create_ui()
        
        # Log area
        self.log("Modbus Data Logger started")

    def create_ui(self):
        notebook = ttk.Notebook(self.root)
        notebook.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Create tabs
        settings_frame = ttk.Frame(notebook)
        log_frame = ttk.Frame(notebook)
        data_frame = ttk.Frame(notebook)
        
        notebook.add(settings_frame, text="Settings")
        notebook.add(log_frame, text="Log")
        notebook.add(data_frame, text="Data")
        
        # Settings Tab
        self.create_settings_tab(settings_frame)
        
        # Log Tab
        self.create_log_tab(log_frame)
        
        # Data Tab
        self.create_data_tab(data_frame)
        
        # Control buttons at the bottom
        control_frame = ttk.Frame(self.root)
        control_frame.pack(fill=tk.X, padx=10, pady=10)
        
        self.start_button = ttk.Button(control_frame, text="Start Logging", command=self.start_logging)
        self.start_button.pack(side=tk.LEFT, padx=5)
        
        self.stop_button = ttk.Button(control_frame, text="Stop Logging", command=self.stop_logging, state=tk.DISABLED)
        self.stop_button.pack(side=tk.LEFT, padx=5)
        
        ttk.Button(control_frame, text="Exit", command=self.on_exit).pack(side=tk.RIGHT, padx=5)



    def create_settings_tab(self, parent):
        settings_frame = ttk.LabelFrame(parent, text="Connection Settings")
        settings_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Left column - Connection settings
        left_frame = ttk.Frame(settings_frame)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        ttk.Label(left_frame, text="Modbus Type:").grid(row=0, column=0, sticky=tk.W, pady=2)
        ttk.Radiobutton(left_frame, text="TCP", variable=self.modbus_type, value="tcp", command=self.update_fields).grid(row=0, column=1, sticky=tk.W, pady=2)
        ttk.Radiobutton(left_frame, text="RTU (Serial)", variable=self.modbus_type, value="rtu", command=self.update_fields).grid(row=0, column=2, sticky=tk.W, pady=2)
        
        # TCP Settings
        self.tcp_frame = ttk.LabelFrame(left_frame, text="TCP Settings")
        self.tcp_frame.grid(row=1, column=0, columnspan=3, sticky=tk.W+tk.E, pady=5)
        
        ttk.Label(self.tcp_frame, text="PLC IP:").grid(row=0, column=0, sticky=tk.W, pady=2)
        ttk.Entry(self.tcp_frame, textvariable=self.plc_ip, width=15).grid(row=0, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(self.tcp_frame, text="Port:").grid(row=1, column=0, sticky=tk.W, pady=2)
        ttk.Entry(self.tcp_frame, textvariable=self.plc_port, width=6).grid(row=1, column=1, sticky=tk.W, pady=2)
        
        # RTU Settings
        self.rtu_frame = ttk.LabelFrame(left_frame, text="RTU Settings")
        self.rtu_frame.grid(row=2, column=0, columnspan=3, sticky=tk.W+tk.E, pady=5)
        
        ttk.Label(self.rtu_frame, text="Serial Port:").grid(row=0, column=0, sticky=tk.W, pady=2)
        ttk.Entry(self.rtu_frame, textvariable=self.serial_port, width=10).grid(row=0, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(self.rtu_frame, text="Baudrate:").grid(row=1, column=0, sticky=tk.W, pady=2)
        ttk.Combobox(self.rtu_frame, textvariable=self.baudrate, width=8, values=[1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200]).grid(row=1, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(self.rtu_frame, text="Parity:").grid(row=2, column=0, sticky=tk.W, pady=2)
        ttk.Combobox(self.rtu_frame, textvariable=self.parity, width=3, values=["N", "E", "O"]).grid(row=2, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(self.rtu_frame, text="Stopbits:").grid(row=3, column=0, sticky=tk.W, pady=2)
        ttk.Combobox(self.rtu_frame, textvariable=self.stopbits, width=3, values=[1, 2]).grid(row=3, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(self.rtu_frame, text="Bytesize:").grid(row=4, column=0, sticky=tk.W, pady=2)
        ttk.Combobox(self.rtu_frame, textvariable=self.bytesize, width=3, values=[5, 6, 7, 8]).grid(row=4, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(self.rtu_frame, text="Timeout:").grid(row=5, column=0, sticky=tk.W, pady=2)
        ttk.Entry(self.rtu_frame, textvariable=self.timeout, width=3).grid(row=5, column=1, sticky=tk.W, pady=2)
        
        # Right column - Register settings
        right_frame = ttk.Frame(settings_frame)
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        register_frame = ttk.LabelFrame(right_frame, text="Modbus Register Settings")
        register_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(register_frame, text="Register Address:").grid(row=0, column=0, sticky=tk.W, pady=2)
        ttk.Entry(register_frame, textvariable=self.register_address, width=10).grid(row=0, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(register_frame, text="Register Count:").grid(row=1, column=0, sticky=tk.W, pady=2)
        ttk.Entry(register_frame, textvariable=self.register_count, width=5).grid(row=1, column=1, sticky=tk.W, pady=2)
        
        ttk.Label(register_frame, text="Unit ID:").grid(row=2, column=0, sticky=tk.W, pady=2)
        ttk.Entry(register_frame, textvariable=self.unit_id, width=5).grid(row=2, column=1, sticky=tk.W, pady=2)
        
        # Logging settings
        log_settings_frame = ttk.LabelFrame(right_frame, text="Logging Settings")
        log_settings_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(log_settings_frame, text="CSV File:").grid(row=0, column=0, sticky=tk.W, pady=2)
        ttk.Entry(log_settings_frame, textvariable=self.csv_file, width=20).grid(row=0, column=1, sticky=tk.W, pady=2)
        ttk.Button(log_settings_frame, text="Browse...", command=self.browse_csv).grid(row=0, column=2, sticky=tk.W, pady=2)
        
        ttk.Label(log_settings_frame, text="Log Interval (s):").grid(row=1, column=0, sticky=tk.W, pady=2)
        ttk.Entry(log_settings_frame, textvariable=self.log_interval, width=5).grid(row=1, column=1, sticky=tk.W, pady=2)
        
        # Update fields based on current selection
        self.update_fields()

    def create_log_tab(self, parent):
        # Log display
        log_frame = ttk.Frame(parent)
        log_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Log text area
        self.log_text = scrolledtext.ScrolledText(log_frame, wrap=tk.WORD, height=20)
        self.log_text.pack(fill=tk.BOTH, expand=True)
        self.log_text.config(state=tk.DISABLED)
        
        # Button to clear log
        ttk.Button(log_frame, text="Clear Log", command=self.clear_log).pack(pady=5)

    def create_data_tab(self, parent):
        # Data display
        data_frame = ttk.Frame(parent)
        data_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Table for data
        self.tree = ttk.Treeview(data_frame, columns=("timestamp", "value"), show="headings")
        self.tree.heading("timestamp", text="Timestamp")
        self.tree.heading("value", text="Value")
        self.tree.column("timestamp", width=200)
        self.tree.column("value", width=100)
        self.tree.pack(fill=tk.BOTH, expand=True)
        
        # Scrollbar
        scrollbar = ttk.Scrollbar(self.tree, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    def update_fields(self):
        # Enable/disable fields based on Modbus type
        if self.modbus_type.get() == "tcp":
            for child in self.tcp_frame.winfo_children():
                child.configure(state=tk.NORMAL)
            for child in self.rtu_frame.winfo_children():
                child.configure(state=tk.DISABLED)
        else:
            for child in self.tcp_frame.winfo_children():
                child.configure(state=tk.DISABLED)
            for child in self.rtu_frame.winfo_children():
                child.configure(state=tk.NORMAL)

    def browse_csv(self):
        filename = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )
        if filename:
            self.csv_file.set(filename)

    def log(self, message):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_message = f"[{timestamp}] {message}\n"
        
        self.log_text.config(state=tk.NORMAL)
        self.log_text.insert(tk.END, log_message)
        self.log_text.see(tk.END)
        self.log_text.config(state=tk.DISABLED)
        
        # Also print to console for debugging
        print(log_message.strip())

    def clear_log(self):
        self.log_text.config(state=tk.NORMAL)
        self.log_text.delete(1.0, tk.END)
        self.log_text.config(state=tk.DISABLED)

    def add_data_row(self, timestamp, value):
        self.tree.insert("", 0, values=(timestamp, value))
        
        # Limit to 1000 rows to prevent memory issues
        if len(self.tree.get_children()) > 1000:
            self.tree.delete(self.tree.get_children()[-1])

    def start_logging(self):
        # Validate settings
        try:
            # Convert register address from hex string if needed
            if self.register_address.get().startswith("0x"):
                register_addr = int(self.register_address.get(), 16)
            else:
                register_addr = int(self.register_address.get())
                
            # Update GUI state
            self.start_button.config(state=tk.DISABLED)
            self.stop_button.config(state=tk.NORMAL)
            
            # Set log running flag
            self.log_running = True
            
            # Start logging thread
            self.log_thread = threading.Thread(target=self.logging_thread, args=(
                self.modbus_type.get(),
                self.plc_ip.get(),
                self.plc_port.get(),
                self.serial_port.get(),
                self.baudrate.get(),
                self.parity.get(),
                self.stopbits.get(),
                self.bytesize.get(),
                self.timeout.get(),
                register_addr,
                self.register_count.get(),
                self.unit_id.get(),
                self.csv_file.get(),
                self.log_interval.get()
            ))
            self.log_thread.daemon = True
            self.log_thread.start()
            
        except ValueError as e:
            messagebox.showerror("Invalid Settings", f"Invalid settings: {str(e)}")
            self.start_button.config(state=tk.NORMAL)
            self.stop_button.config(state=tk.DISABLED)

    def stop_logging(self):
        self.log_running = False
        self.log("Stopping data logging...")
        self.start_button.config(state=tk.NORMAL)
        self.stop_button.config(state=tk.DISABLED)

    def connect_to_plc(self, modbus_type, plc_ip, plc_port, serial_port, baudrate, parity, stopbits, bytesize, timeout):
        """Connects to the PLC using either Modbus TCP or Modbus RTU."""
        try:
            if modbus_type == "tcp":
                client = ModbusTcpClient(plc_ip, port=plc_port)
                self.log(f"Attempting to connect to PLC at {plc_ip}:{plc_port} via Modbus TCP")
            else:
                client = ModbusSerialClient(
                    port=serial_port,
                    baudrate=baudrate,
                    parity=parity,
                    stopbits=stopbits,
                    bytesize=bytesize,
                    timeout=timeout,
                )
                self.log(f"Attempting to connect to PLC at {serial_port} via Modbus RTU")

            if client.connect():
                self.log(f"✅ Connected to PLC via Modbus {modbus_type.upper()}")
                return client
            else:
                self.log("❌ Failed to connect to PLC")
                return None
                
        except Exception as e:
            self.log(f"❌ Exception while connecting to PLC: {str(e)}")
            return None

    def read_plc_data(self, client, register_address, register_count, unit_id):
        """Reads data from PLC coils."""
        try:
            response = client.read_coils(address=6304, count=1)
            
            if hasattr(response, 'isError') and response.isError():
                self.log(f"❌ Modbus Error: {response}")
                return None
            else:
                return response.bits  # ✅ Correct attribute for coils (True/False list)

        except Exception as e:
            self.log(f"❌ Exception while reading PLC: {str(e)}")
            return None

    def initialize_csv(self, csv_file, register_address, register_count):
        """Creates a new CSV file with headers if it doesn't exist."""
        if not os.path.exists(csv_file):
            with open(csv_file, mode="w", newline="") as file:
                writer = csv.writer(file)
                headers = ["Timestamp"] + [f"Register_{register_address + i}" for i in range(register_count)]
                writer.writerow(headers)
            self.log(f"✅ Created new CSV file: {csv_file}")

    def save_to_csv(self, csv_file, data):
        """Saves PLC data to a CSV file with timestamps."""
        if data is None:
            self.log("⚠️ No data to save")
            return

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Open CSV in append mode
        with open(csv_file, mode="a", newline="") as file:
            writer = csv.writer(file)
            writer.writerow([timestamp] + [1 if bit else 0 for bit in data])  # Convert boolean to 1/0
        
        # Format data for display
        data_str = [1 if bit else 0 for bit in data]
        self.log(f"✅ Data logged at {timestamp}: {data_str}")
        
        # Add to data display
        for i, bit in enumerate(data):
            value = 1 if bit else 0
            self.root.after(0, lambda t=timestamp, v=value: self.add_data_row(t, v))

    def logging_thread(self, modbus_type, plc_ip, plc_port, serial_port, baudrate, parity, stopbits, bytesize, timeout, 
                     register_address, register_count, unit_id, csv_file, log_interval):
        """Thread function for logging data."""
        # Initialize CSV file with headers
        self.initialize_csv(csv_file, register_address, register_count)
        
        # Connect to PLC
        client = self.connect_to_plc(modbus_type, plc_ip, plc_port, serial_port, baudrate, parity, stopbits, bytesize, timeout)
        if client is None:
            retry_count = 0
            while client is None and retry_count < self.max_reconnect_attempts and self.log_running:
                self.log(f"Retrying connection ({retry_count + 1}/{self.max_reconnect_attempts})...")
                time.sleep(5)  # Wait before retry
                retry_count += 1
                client = self.connect_to_plc(modbus_type, plc_ip, plc_port, serial_port, baudrate, parity, stopbits, bytesize, timeout)
                
            if client is None:
                self.log("Failed to connect after multiple attempts. Exiting.")
                self.root.after(0, self.stop_logging)
                return

        self.log("📡 Starting data logging...")

        try:
            reconnect_count = 0
            while self.log_running:
                data = self.read_plc_data(client, register_address, register_count, unit_id)
                
                # Handle connection loss during operation
                if data is None and reconnect_count < self.max_reconnect_attempts:
                    self.log(f"Connection may be lost. Attempting to reconnect ({reconnect_count + 1}/{self.max_reconnect_attempts})...")
                    client.close()
                    time.sleep(2)
                    client = self.connect_to_plc(modbus_type, plc_ip, plc_port, serial_port, baudrate, parity, stopbits, bytesize, timeout)
                    reconnect_count += 1
                    if client is None:
                        continue
                elif data is None:
                    self.log("Too many failed read attempts. Stopping logging.")
                    break
                else:
                    reconnect_count = 0  # Reset counter on successful read
                    
                self.save_to_csv(csv_file, data)
                time.sleep(log_interval)  # Wait before next read

        except Exception as e:
            self.log(f"Error in logging thread: {str(e)}")
        finally:
            if client is not None:
                client.close()
            self.log("Connection closed. Logging stopped.")
            self.root.after(0, self.stop_logging)

    def on_exit(self):
        if self.log_running:
            if messagebox.askyesno("Exit", "Logging is still running. Are you sure you want to exit?"):
                self.stop_logging()
                self.root.destroy()
        else:
            self.root.destroy()

if __name__ == "__main__":
    root = tk.Tk()
    app = ModbusLoggerUI(root)
    
    # Handle window close event
    root.protocol("WM_DELETE_WINDOW", app.on_exit)
    
    # Start main loop
    root.mainloop()