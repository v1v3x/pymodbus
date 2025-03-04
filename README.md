## **PyModbus GUI – Modbus Communication with a User Interface**  

### **Overview**  
**PyModbus GUI** is a Python-based graphical user interface (GUI) for communicating with **Modbus devices** (RTU/TCP). It allows users to **read/write Modbus registers**, visualize real-time data, and interact with **Modbus-compatible industrial devices** effortlessly.  

### **Features**  
✅ **Connect to Modbus RTU & TCP Devices**  
✅ **Read/Write Holding & Input Registers**  
✅ **Real-Time Data Monitoring**  
✅ **User-Friendly GUI (Tkinter)**  
✅ **Error Handling & Connection Diagnostics**  

---

## **1️⃣ Installation**  

### **🔹 Prerequisites**  
Before running the application, make sure you have **Python 3.7+** installed. You can check your Python version using:  
```bash
python --version
```

### **🔹 Clone the Repository**  
```bash
git clone https://github.com/your-username/pymodbus-gui.git
cd pymodbus-gui
```

### **🔹 Install Dependencies**  
Run the following command to install the required packages:  
```bash
pip install -r requirements.txt
```

---

## **2️⃣ How to Run the Application**  

### **🔹 Run the GUI**  
To start the **PyModbus GUI**, execute:  
```bash
python main.py
```

### **🔹 Modbus Connection Settings**  
- **Modbus RTU (Serial Port)**  
  - COM Port (e.g., `COM3` or `/dev/ttyUSB0`)  
  - Baud Rate (9600, 19200, etc.)  
  - Parity, Stop Bits, and Timeout  

- **Modbus TCP (Ethernet/Internet)**  
  - IP Address (e.g., `192.168.1.100`)  
  - Port (Default: `502`)  

---

## **3️⃣ Usage Guide**  

### **🔹 Connect to a Modbus Device**  
1. **Select Modbus Type**: RTU (Serial) or TCP (Ethernet)  
2. **Enter Connection Parameters** (COM Port/IP Address, Baud Rate, etc.)  
3. Click **"Connect"**  

### **🔹 Read Registers**  
1. Select **Function Code** (e.g., `Read Coil Registers (FC3)`)  
2. Enter **Slave ID**, **Register Address**, and **Number of Registers**  
3. Click **"Read"** to fetch data  

### **🔹 Write Registers**  
1. Select **Function Code** (e.g., `Write Single Register (FC6)`)  
2. Enter **Slave ID**, **Register Address**, and **Value**  
3. Click **"Write"** to send data  

---

## **4️⃣ Folder Structure**  
```
pymodbus-gui/
│── gui/                  # GUI-related files
│── modbus/               # Modbus communication scripts
│── main.py               # Main script to run the app
│── config.py             # Configuration settings
│── utils.py              # Utility functions (e.g., logging, error handling)
│── README.md             # Project documentation
│── requirements.txt      # Python dependencies
│── .gitignore            # Files to ignore in Git
```

---

## **5️⃣ Requirements File (`requirements.txt`)**  
Ensure you have all necessary dependencies installed:  
```txt
pymodbus
tkinter 
pyserial
```
Install them with:  
```bash
pip install -r requirements.txt
```

---

## **6️⃣ Troubleshooting & Common Issues**  

### **🔹 No Response from Modbus Device**  
- Check if the **Modbus device is powered on**  
- Verify the **COM port / IP Address & Port**  
- Ensure **Baud Rate, Parity, and Stop Bits** match  

### **🔹 Connection Timeout or Failure**  
- For **Modbus RTU**: Ensure the correct **USB-to-RS485 converter** is used  
- For **Modbus TCP**: Make sure the **firewall is not blocking port 502**  

### **🔹 "ModuleNotFoundError" for `pymodbus` or `pyserial`**  
- Run:  
  ```bash
  pip install pymodbus pyserial
  ```

---

## **7️⃣ Future Enhancements 🚀**  
📌 **Graphical Data Plotting** (Live Charts for Modbus Data)  
📌 **CSV Export of Modbus Readings**  
📌 **Modbus Coil Status Control**  
📌 **Multi-Slave Support**  

---

## **8️⃣ License**  
This project is licensed under the **MIT License** – feel free to modify and improve it!  

---

## **9️⃣ Contribution Guidelines**  
Contributions are welcome! Follow these steps to contribute:  
1. **Fork the Repository**  
2. **Create a Feature Branch**  
   ```bash
   git checkout -b feature-branch
   ```
3. **Make Changes & Commit**  
   ```bash
   git add .
   git commit -m "Added new feature"
   ```
4. **Push & Create a Pull Request**  
   ```bash
   git push origin feature-branch
   ```
5. Open a **Pull Request (PR)** on GitHub  

---

### **🔗 Connect with Me**  
📧 **Email**: vivekrandad20@gmail.com
🐦 **X**: https://x.com/vvkrandad
