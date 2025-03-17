
export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const features: Feature[] = [
  {
    id: "sync-client",
    title: "Synchronous Client",
    description: "Communicate with Modbus devices using the synchronous API, with support for RTU, TCP, and TLS variants.",
    icon: "ArrowLeftRight",
  },
  {
    id: "async-client",
    title: "Asynchronous Client",
    description: "Leverage asynchronous I/O with support for asyncio, providing efficient concurrent communication with multiple devices.",
    icon: "Layers",
  },
  {
    id: "sync-server",
    title: "Synchronous Server",
    description: "Create Modbus server implementations that respond to client requests, supporting all common Modbus function codes.",
    icon: "Server",
  },
  {
    id: "async-server",
    title: "Asynchronous Server",
    description: "Build high-performance Modbus servers using asyncio for handling multiple client connections concurrently.",
    icon: "Network",
  },
  {
    id: "repl",
    title: "REPL",
    description: "Interactive command line tool for testing Modbus devices quickly, with support for scripting and automation.",
    icon: "Terminal",
  },
  {
    id: "protocols",
    title: "Multiple Protocols",
    description: "Support for Modbus RTU, ASCII, TCP, UDP, TLS and variants, allowing communication across different transport layers.",
    icon: "Layers3",
  },
  {
    id: "extensions",
    title: "Protocol Extensions",
    description: "Implementations of common Modbus extensions including custom function codes and protocol variants.",
    icon: "Puzzle",
  },
  {
    id: "testing",
    title: "Testing Tools",
    description: "Comprehensive testing utilities and simulators for verifying Modbus implementations and device behavior.",
    icon: "TestTube",
  },
];

export const codeExamples = [
  {
    id: "sync-client-example",
    title: "Synchronous Client Example",
    language: "python",
    code: `from pymodbus.client import ModbusSerialClient

# Create a Modbus RTU client
client = ModbusSerialClient(port='/dev/ttyUSB0', baudrate=9600)
client.connect()

# Read holding registers
result = client.read_holding_registers(address=0, count=10, slave=1)
if not result.isError():
    print(result.registers)

client.close()`,
  },
  {
    id: "async-client-example",
    title: "Asynchronous Client Example",
    language: "python",
    code: `import asyncio
from pymodbus.client import AsyncModbusTcpClient

async def run_async_client():
    # Create a Modbus TCP client
    client = AsyncModbusTcpClient('localhost', port=502)
    await client.connect()
    
    # Read input registers
    result = await client.read_input_registers(0, 10, slave=1)
    if not result.isError():
        print(result.registers)
    
    await client.close()

asyncio.run(run_async_client())`,
  },
  {
    id: "server-example",
    title: "Server Example",
    language: "python",
    code: `from pymodbus.server import StartTcpServer
from pymodbus.datastore import ModbusSequentialDataBlock
from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext

# Define data storage
block = ModbusSequentialDataBlock(0, [0]*100)
store = ModbusSlaveContext(
    di=block, co=block, hr=block, ir=block, unit=1
)
context = ModbusServerContext(slaves=store, single=True)

# Start Modbus TCP server
StartTcpServer(context, address=("localhost", 502))`,
  },
];
