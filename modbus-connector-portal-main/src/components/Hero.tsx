
import { Button } from "@/components/ui/button";
import { ChevronRight, Terminal, Zap, Server } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20 pt-32 pb-24">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--color-primary),0.1),transparent_50%)]"></div>
      
      <div className="container px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5"
          >
            <span className="text-sm font-medium text-primary">
              Modbus for Python
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            A full-featured Modbus
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500"> protocol stack </span>
            in Python
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl"
          >
            PyModbus is a fully featured Modbus protocol implementation supporting both synchronous and asynchronous communications.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-6"
          >
            <Button size="lg" asChild>
              <a href="https://github.com/v1v3x/pymodbus/blob/master/README.md" target="_blank" rel="noopener noreferrer">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/v1v3x/pymodbus" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="flex flex-col items-center text-center space-y-2 p-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Terminal className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Sync & Async APIs</h3>
            <p className="text-sm text-muted-foreground">
              Choose between synchronous and asynchronous APIs for your specific application needs.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-2 p-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Multiple Transports</h3>
            <p className="text-sm text-muted-foreground">
              Support for RTU, ASCII, TCP, UDP, and TLS variants of the Modbus protocol.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-2 p-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Server className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Client & Server</h3>
            <p className="text-sm text-muted-foreground">
              Implement both Modbus clients and servers with comprehensive function code support.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
