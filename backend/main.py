from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import asyncio
import json
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, db
from pymodbus.client import ModbusTcpClient, ModbusSerialClient
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Firebase
try:
    cred = credentials.Certificate("firebase-credentials.json")
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'YOUR_FIREBASE_DATABASE_URL'
    })
except Exception as e:
    logger.error(f"Firebase initialization error: {e}")

app = FastAPI(title="Modbus Connector API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active connections
active_connections: Dict[str, WebSocket] = {}
modbus_clients: Dict[str, any] = {}

class ModbusConnection(BaseModel):
    connection_type: str  # "tcp" or "rtu"
    device_id: str
    # TCP settings
    host: Optional[str] = None
    port: Optional[int] = None
    # RTU settings
    port_name: Optional[str] = None
    baudrate: Optional[int] = None
    parity: Optional[str] = None
    stopbits: Optional[int] = None
    bytesize: Optional[int] = None
    timeout: Optional[int] = None

class ModbusReadRequest(BaseModel):
    device_id: str
    address: int
    count: int
    unit_id: int = 1

@app.post("/connect")
async def connect_modbus(connection: ModbusConnection):
    try:
        if connection.connection_type == "tcp":
            client = ModbusTcpClient(
                host=connection.host,
                port=connection.port,
                timeout=connection.timeout or 1
            )
        else:  # RTU
            client = ModbusSerialClient(
                port=connection.port_name,
                baudrate=connection.baudrate or 9600,
                parity=connection.parity or 'N',
                stopbits=connection.stopbits or 1,
                bytesize=connection.bytesize or 8,
                timeout=connection.timeout or 1
            )

        if client.connect():
            modbus_clients[connection.device_id] = client
            # Log connection to Firebase
            db.reference(f'connections/{connection.device_id}').set({
                'status': 'connected',
                'type': connection.connection_type,
                'last_connected': datetime.now().isoformat()
            })
            return {"status": "success", "message": "Connected successfully"}
        else:
            raise HTTPException(status_code=400, detail="Failed to connect")
    except Exception as e:
        logger.error(f"Connection error: {e}")
        # Log error to Firebase
        db.reference(f'connections/{connection.device_id}').set({
            'status': 'error',
            'error': str(e),
            'last_error': datetime.now().isoformat()
        })
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/disconnect/{device_id}")
async def disconnect_modbus(device_id: str):
    try:
        if device_id in modbus_clients:
            client = modbus_clients[device_id]
            client.close()
            del modbus_clients[device_id]
            # Log disconnection to Firebase
            db.reference(f'connections/{device_id}').set({
                'status': 'disconnected',
                'last_disconnected': datetime.now().isoformat()
            })
            return {"status": "success", "message": "Disconnected successfully"}
        else:
            raise HTTPException(status_code=404, detail="Device not found")
    except Exception as e:
        logger.error(f"Disconnection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/read")
async def read_modbus(request: ModbusReadRequest):
    try:
        if request.device_id not in modbus_clients:
            raise HTTPException(status_code=404, detail="Device not connected")
        
        client = modbus_clients[request.device_id]
        result = client.read_holding_registers(
            address=request.address,
            count=request.count,
            unit=request.unit_id
        )
        
        if result.isError():
            raise HTTPException(status_code=400, detail="Read operation failed")
        
        # Log reading to Firebase
        db.reference(f'readings/{request.device_id}').push({
            'address': request.address,
            'count': request.count,
            'values': result.registers,
            'timestamp': datetime.now().isoformat()
        })
        
        return {
            "status": "success",
            "values": result.registers
        }
    except Exception as e:
        logger.error(f"Read error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/{device_id}")
async def websocket_endpoint(websocket: WebSocket, device_id: str):
    await websocket.accept()
    active_connections[device_id] = websocket
    try:
        while True:
            data = await websocket.receive_text()
            # Handle real-time data updates
            try:
                message = json.loads(data)
                if message.get("type") == "read":
                    if device_id in modbus_clients:
                        client = modbus_clients[device_id]
                        result = client.read_holding_registers(
                            address=message["address"],
                            count=message["count"],
                            unit=message.get("unit_id", 1)
                        )
                        if not result.isError():
                            await websocket.send_json({
                                "type": "data",
                                "values": result.registers,
                                "timestamp": datetime.now().isoformat()
                            })
            except Exception as e:
                await websocket.send_json({
                    "type": "error",
                    "message": str(e)
                })
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        if device_id in active_connections:
            del active_connections[device_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 