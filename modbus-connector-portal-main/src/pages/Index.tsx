
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import CodeBlock from "@/components/CodeBlock";
import Footer from "@/components/Footer";
import { features, codeExamples } from "@/lib/features";
import { ChevronRight, ArrowRight, Terminal, Github, Book, Package, Users, ArrowLeftRight, Layers, Server, Network, TestTube, Layers3, Puzzle } from "lucide-react";
import { motion } from "framer-motion";

const getIconByName = (name: string) => {
  const iconMap: Record<string, any> = {
    "ArrowLeftRight": ArrowLeftRight,
    "Layers": Layers,
    "Server": Server,
    "Network": Network,
    "Terminal": Terminal,
    "Layers3": Layers3,
    "Puzzle": Puzzle,
    "TestTube": TestTube,
  };
  
  return iconMap[name] || Terminal;
};

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Features Section */}
        <section className="py-24 bg-background relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_left,rgba(var(--color-primary),0.08),transparent_50%)]"></div>
          
          <div className="container px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
              >
                Comprehensive Modbus Protocol Support
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-muted-foreground"
              >
                PyModbus provides a complete implementation of the Modbus protocol for building both clients and servers.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.id}
                  icon={getIconByName(feature.icon)}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Code Examples Section */}
        <section className="py-24 bg-muted/30">
          <div className="container px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
              >
                Simple and Intuitive API
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-muted-foreground"
              >
                Get started with PyModbus quickly using our straightforward API for both synchronous and asynchronous applications.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {codeExamples.slice(0, 2).map((example, index) => (
                <motion.div
                  key={example.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <CodeBlock
                    code={example.code}
                    language="python"
                    title={example.title}
                  />
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <a href="/examples">
                  View More Examples
                  <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-background">
          <div className="container px-4 sm:px-6">
            <div className="max-w-4xl mx-auto overflow-hidden rounded-lg bg-gradient-to-r from-primary/90 to-blue-600/90 shadow-lg">
              <div className="px-8 py-16 sm:p-16 relative z-10">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent_40%)]"></div>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
                >
                  Ready to start building with PyModbus?
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-4 text-lg text-white/90"
                >
                  Start integrating industrial devices and systems with our comprehensive Modbus protocol implementation.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-8 flex flex-col sm:flex-row gap-4"
                >
                  <Button size="lg" variant="secondary" asChild>
                    <a href="https://github.com/v1v3x/pymodbus/blob/master/README.md" target="_blank" rel="noopener noreferrer">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" asChild>
                    <a href="https://github.com/v1v3x/pymodbus" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Star on GitHub
                    </a>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Getting Started */}
        <section className="py-24 bg-muted/30">
          <div className="container px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl font-bold tracking-tight sm:text-4xl mb-6"
                >
                  Get Started in Minutes
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg text-muted-foreground mb-8"
                >
                  PyModbus is easy to install and integrate into your existing Python projects. Follow our simple installation guide to get up and running quickly.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full">
                      <Terminal className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Simple Installation</h3>
                      <p className="text-muted-foreground">
                        Install with pip: <code className="bg-muted rounded px-1 py-0.5">pip install pymodbus</code>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full">
                      <Book className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Comprehensive Documentation</h3>
                      <p className="text-muted-foreground">
                        Detailed guides and API documentation to help you implement your Modbus solutions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Example Applications</h3>
                      <p className="text-muted-foreground">
                        Ready-to-use examples for common Modbus applications and use cases.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Active Community</h3>
                      <p className="text-muted-foreground">
                        Join our community of developers and industrial automation experts.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="rounded-lg overflow-hidden border shadow-lg">
                  <CodeBlock
                    code={codeExamples[2].code}
                    language="python"
                    title="Server Example"
                    showLineNumbers={true}
                  />
                </div>
                <div className="absolute -z-10 top-10 left-10 right-10 bottom-10 rounded-lg bg-primary/20 blur-2xl"></div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
