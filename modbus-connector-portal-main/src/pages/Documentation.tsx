
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, ChevronDown, BookOpen, ArrowRight, Search, Code, Server, Cpu, Network, Shield, Zap, Download } from "lucide-react";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";

const Documentation = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };
  
  const sections = [
    {
      id: "installation",
      title: "Installation",
      icon: <Download className="h-5 w-5" />,
      content: (
        <div>
          <p className="mb-4 text-muted-foreground">
            PyModbus can be installed from PyPI using pip:
          </p>
          <CodeBlock
            code="pip install pymodbus"
            language="bash"
            title="Basic Installation"
          />
          <p className="mt-4 mb-4 text-muted-foreground">
            For development or to install with additional dependencies:
          </p>
          <CodeBlock
            code="pip install -e .[dev]"
            language="bash"
            title="Development Installation"
          />
        </div>
      )
    },
    {
      id: "client-usage",
      title: "Client Usage",
      icon: <Code className="h-5 w-5" />,
      content: (
        <div>
          <p className="mb-4 text-muted-foreground">
            The PyModbus library provides both synchronous and asynchronous client implementations. Here are examples of basic usage:
          </p>
          <h4 className="text-xl font-medium mb-2">Synchronous Client</h4>
          <CodeBlock
            code={`from pymodbus.client import ModbusSerialClient, ModbusTcpClient

# RTU Client
client = ModbusSerialClient(port='/dev/ttyUSB0', baudrate=9600, parity='N', stopbits=1)
client.connect()
result = client.read_holding_registers(0, 10, slave=1)
if not result.isError():
    print(result.registers)
client.close()

# TCP Client
client = ModbusTcpClient('127.0.0.1', port=502)
client.connect()
result = client.read_coils(0, 8, slave=1)
if not result.isError():
    print(result.bits)
client.close()`}
            language="python"
            title="Synchronous Client Examples"
          />
          <h4 className="text-xl font-medium mb-2 mt-8">Asynchronous Client</h4>
          <CodeBlock
            code={`import asyncio
from pymodbus.client import AsyncModbusSerialClient, AsyncModbusTcpClient

async def run_async_client():
    # Async RTU Client
    client = AsyncModbusSerialClient(port='/dev/ttyUSB0', baudrate=9600)
    await client.connect()
    result = await client.read_holding_registers(0, 10, slave=1)
    if not result.isError():
        print(result.registers)
    await client.close()
    
    # Async TCP Client
    client = AsyncModbusTcpClient('127.0.0.1', port=502)
    await client.connect()
    result = await client.read_coils(0, 8, slave=1)
    if not result.isError():
        print(result.bits)
    await client.close()

asyncio.run(run_async_client())`}
            language="python"
            title="Asynchronous Client Examples"
          />
        </div>
      )
    },
    {
      id: "server-usage",
      title: "Server Usage",
      icon: <Server className="h-5 w-5" />,
      content: (
        <div>
          <p className="mb-4 text-muted-foreground">
            PyModbus allows you to create Modbus servers that can respond to client requests. Here's how to set up basic servers:
          </p>
          <h4 className="text-xl font-medium mb-2">Synchronous Server</h4>
          <CodeBlock
            code={`from pymodbus.server import StartTcpServer, StartSerialServer
from pymodbus.datastore import ModbusSequentialDataBlock
from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext

# Create a datastore
block = ModbusSequentialDataBlock(0, [0]*100)
store = ModbusSlaveContext(
    di=block, co=block, hr=block, ir=block, unit=1
)
context = ModbusServerContext(slaves=store, single=True)

# TCP Server
StartTcpServer(context, address=("localhost", 502))

# RTU Server
# StartSerialServer(context, port='/dev/ttyUSB0', baudrate=9600)`}
            language="python"
            title="Synchronous Server Examples"
          />
          <h4 className="text-xl font-medium mb-2 mt-8">Asynchronous Server</h4>
          <CodeBlock
            code={`import asyncio
from pymodbus.server import StartAsyncTcpServer, StartAsyncSerialServer
from pymodbus.datastore import ModbusSequentialDataBlock
from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext

async def run_async_server():
    # Create a datastore
    block = ModbusSequentialDataBlock(0, [0]*100)
    store = ModbusSlaveContext(
        di=block, co=block, hr=block, ir=block, unit=1
    )
    context = ModbusServerContext(slaves=store, single=True)

    # TCP Server
    await StartAsyncTcpServer(context, address=("localhost", 502))
    
    # RTU Server
    # await StartAsyncSerialServer(context, port='/dev/ttyUSB0', baudrate=9600)

asyncio.run(run_async_server())`}
            language="python"
            title="Asynchronous Server Examples"
          />
        </div>
      )
    },
    {
      id: "datastore",
      title: "Datastore Configuration",
      icon: <Cpu className="h-5 w-5" />,
      content: (
        <div>
          <p className="mb-4 text-muted-foreground">
            PyModbus provides flexible datastores for managing the data in your Modbus servers. Here's how to configure different types of datastores:
          </p>
          <CodeBlock
            code={`from pymodbus.datastore import (
    ModbusSequentialDataBlock, ModbusSparseDataBlock,
    ModbusSlaveContext, ModbusServerContext
)

# Sequential Datastore - continuous block of memory
sequential_block = ModbusSequentialDataBlock(0, [0]*100)

# Sparse Datastore - disconnected blocks of memory
values = {0: 0, 1: 1, 2: 2, 5: 5, 10: 10}
sparse_block = ModbusSparseDataBlock(values)

# Create a context with multiple slave units
slaves = {
    0x01: ModbusSlaveContext(
        di=sequential_block, co=sequential_block,
        hr=sequential_block, ir=sequential_block
    ),
    0x02: ModbusSlaveContext(
        di=sparse_block, co=sparse_block,
        hr=sparse_block, ir=sparse_block
    )
}

# Server context with multiple slaves
context = ModbusServerContext(slaves=slaves, single=False)`}
            language="python"
            title="Datastore Configuration Examples"
          />
        </div>
      )
    },
    {
      id: "protocols",
      title: "Protocol Support",
      icon: <Network className="h-5 w-5" />,
      content: (
        <div>
          <p className="mb-4 text-muted-foreground">
            PyModbus supports various Modbus protocol variants. Here's an overview of the different protocol options:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2">Modbus TCP</h4>
              <p className="text-muted-foreground mb-2">Standard Ethernet-based Modbus variant.</p>
              <CodeBlock
                code={`from pymodbus.client import ModbusTcpClient

client = ModbusTcpClient('127.0.0.1', port=502)
client.connect()`}
                language="python"
                title="TCP Example"
              />
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2">Modbus RTU</h4>
              <p className="text-muted-foreground mb-2">Serial-based variant using binary encoding.</p>
              <CodeBlock
                code={`from pymodbus.client import ModbusSerialClient

client = ModbusSerialClient(
    port='/dev/ttyUSB0',
    baudrate=9600,
    parity='N',
    stopbits=1,
    bytesize=8
)
client.connect()`}
                language="python"
                title="RTU Example"
              />
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2">Modbus ASCII</h4>
              <p className="text-muted-foreground mb-2">Serial-based variant using ASCII encoding.</p>
              <CodeBlock
                code={`from pymodbus.client import ModbusSerialClient

client = ModbusSerialClient(
    method='ascii',
    port='/dev/ttyUSB0',
    baudrate=9600,
    parity='N'
)
client.connect()`}
                language="python"
                title="ASCII Example"
              />
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2">Modbus UDP</h4>
              <p className="text-muted-foreground mb-2">UDP-based variant for environments where TCP is not suitable.</p>
              <CodeBlock
                code={`from pymodbus.client import ModbusUdpClient

client = ModbusUdpClient('127.0.0.1', port=502)
client.connect()`}
                language="python"
                title="UDP Example"
              />
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2">Modbus TLS</h4>
              <p className="text-muted-foreground mb-2">Secure variant using TLS encryption.</p>
              <CodeBlock
                code={`from pymodbus.client import ModbusTlsClient

client = ModbusTlsClient(
    'localhost',
    port=802,
    certfile='client.crt',
    keyfile='client.key',
    server_cert='server.crt'
)
client.connect()`}
                language="python"
                title="TLS Example"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "security",
      title: "Security Considerations",
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div>
          <p className="mb-4 text-muted-foreground">
            When implementing Modbus systems, consider these security best practices:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li>Use TLS whenever possible for secure communications</li>
            <li>Implement proper authentication mechanisms</li>
            <li>Restrict access to Modbus devices using firewalls</li>
            <li>Monitor and log all Modbus traffic</li>
            <li>Use read-only access where full control is not required</li>
            <li>Regularly update PyModbus to the latest version</li>
          </ul>
          <h4 className="text-xl font-medium mb-2">TLS Configuration Example</h4>
          <CodeBlock
            code={`from pymodbus.client import ModbusTlsClient

# Client with certificate validation
client = ModbusTlsClient(
    host='localhost',
    port=802,
    certfile='client.crt',
    keyfile='client.key',
    server_cert='server.crt'
)

# Server with TLS
from pymodbus.server import StartTlsServer

StartTlsServer(
    context,
    certfile='server.crt',
    keyfile='server.key',
    address=("localhost", 802)
)`}
            language="python"
            title="TLS Security Example"
          />
        </div>
      )
    },
    {
      id: "performance",
      title: "Performance Optimization",
      icon: <Zap className="h-5 w-5" />,
      content: (
        <div>
          <p className="mb-4 text-muted-foreground">
            Here are some tips for optimizing the performance of your PyModbus applications:
          </p>
          <div className="space-y-4 mb-6">
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2">Use Asynchronous APIs</h4>
              <p className="text-muted-foreground">
                For applications that need to communicate with multiple Modbus devices, use the asynchronous API to improve throughput and reduce latency.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2">Batch Requests</h4>
              <p className="text-muted-foreground">
                Instead of making multiple small requests, batch them into larger requests when possible to reduce overhead.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2">Connection Pooling</h4>
              <p className="text-muted-foreground">
                Reuse connections instead of opening and closing them for each request, especially in high-throughput applications.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-2">Optimize Serial Settings</h4>
              <p className="text-muted-foreground">
                For RTU communication, use the highest baud rate that your devices reliably support.
              </p>
            </div>
          </div>
          <h4 className="text-xl font-medium mb-2">Asynchronous Client with Connection Reuse</h4>
          <CodeBlock
            code={`import asyncio
from pymodbus.client import AsyncModbusTcpClient

async def process_device(client, device_id):
    # Reuse the same client connection for multiple requests
    result1 = await client.read_holding_registers(0, 10, slave=device_id)
    result2 = await client.read_input_registers(0, 10, slave=device_id)
    result3 = await client.read_coils(0, 10, slave=device_id)
    return [result1, result2, result3]

async def main():
    # Create a single client
    client = AsyncModbusTcpClient('localhost', port=502)
    await client.connect()
    
    # Process multiple devices concurrently
    tasks = []
    for device_id in range(1, 11):
        tasks.append(process_device(client, device_id))
    
    # Wait for all tasks to complete
    results = await asyncio.gather(*tasks)
    
    # Close the connection when done
    await client.close()

asyncio.run(main())`}
            language="python"
            title="Performance Optimization Example"
          />
        </div>
      )
    },
  ];
  
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-b from-background to-secondary/20 pt-32 pb-16">
          <div className="container px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold tracking-tight sm:text-5xl mb-6"
              >
                PyModbus Documentation
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-muted-foreground mb-10"
              >
                Comprehensive guide to using the PyModbus library for your Modbus protocol implementation needs.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative max-w-md mx-auto mb-8"
              >
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  className="w-full py-3 pl-10 pr-4 bg-background border rounded-lg"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Button asChild>
                  <a href="#installation">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Quick Start
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://github.com/v1v3x/pymodbus/wiki" target="_blank" rel="noopener noreferrer">
                    API Reference
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Documentation Content */}
        <section className="py-16">
          <div className="container px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <Button
                        key={section.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => toggleSection(section.id)}
                        asChild
                      >
                        <a href={`#${section.id}`} className="flex items-center">
                          <span className="mr-2">{section.icon}</span>
                          <span>{section.title}</span>
                        </a>
                      </Button>
                    ))}
                  </nav>
                </div>
              </div>
              
              {/* Content */}
              <div className="lg:col-span-3 space-y-12">
                {sections.map((section) => (
                  <div key={section.id} id={section.id} className="scroll-mt-24">
                    <div 
                      className="flex items-center justify-between border-b pb-4 cursor-pointer"
                      onClick={() => toggleSection(section.id)}
                    >
                      <h2 className="text-2xl font-bold flex items-center">
                        <span className="mr-3">{section.icon}</span>
                        {section.title}
                      </h2>
                      <ChevronDown 
                        className={`h-5 w-5 transition-transform ${
                          activeSection === section.id ? "rotate-180" : ""
                        }`} 
                      />
                    </div>
                    <div className={`pt-6 transition-all duration-300 ${
                      activeSection === section.id || activeSection === null ? "block" : "hidden"
                    }`}>
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
              <p className="text-muted-foreground mb-8">
                Check out our additional resources or get in touch with the community for assistance with your PyModbus implementation.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild>
                  <a href="/examples">
                    View Examples
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/community">
                    Join Community
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://github.com/v1v3x/pymodbus/issues" target="_blank" rel="noopener noreferrer">
                    Report Issues
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Documentation;
