
import React, { useEffect, useRef, useState } from 'react';
import { Code, Palette, ArrowUpRight, Globe, Zap, Database } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const services = [
  {
    icon: <Palette size={28} />,
    title: "Web Design / UI Systems",
    description: "Beautiful, functional interfaces that enhance user experience and drive engagement.",
    codeSample: "// Design System\nconst colors = {\n  primary: '#3d94ea',\n  accent: '#9370DB'\n};"
  },
  {
    icon: <Code size={28} />,
    title: "Web App Dev (React, Next.js)",
    description: "Scalable web applications built with modern frameworks and best practices.",
    codeSample: "// React Component\nexport const Button = ({\n  children\n}) => (\n  <button className=\"btn\">\n    {children}\n  </button>\n);"
  },
  {
    icon: <Database size={28} />,
    title: "SaaS & Multi-Tenant Systems",
    description: "Complex software-as-a-service platforms with robust authentication and permissions.",
    codeSample: "// Multi-tenant routing\nconst getTenantId = () => {\n  return context.tenant ?? 'default';\n};"
  },
  {
    icon: <Globe size={28} />,
    title: "Web3 & Smart Contracts",
    description: "Blockchain integrations and smart contract development for next-gen applications.",
    codeSample: "// Ethereum Contract\ncontract Token {\n  mapping(address => uint) balance;\n  \n  function transfer() public {\n    // ...\n  }\n}"
  },
  {
    icon: <Zap size={28} />,
    title: "Performance Optimization & SEO",
    description: "Tuning web applications for maximum speed, efficiency, and search visibility.",
    codeSample: "// Performance audit\nconst metrics = {\n  LCP: '1.2s', // Largest Contentful Paint\n  FID: '15ms', // First Input Delay\n  CLS: '0.02'  // Cumulative Layout Shift\n};"
  }
];

const Capabilities = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeService, setActiveService] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ 
    target: sectionRef,
    offset: ["start end", "end start"] 
  });
  
  const serviceOpacity = Array(services.length).fill(0).map((_, i) => {
    return useTransform(
      scrollYProgress,
      [(i - 0.5) / services.length, i / services.length, (i + 1) / services.length, (i + 1.5) / services.length],
      [0.4, 1, 1, 0.4]
    );
  });

  const serviceY = Array(services.length).fill(0).map((_, i) => {
    return useTransform(
      scrollYProgress,
      [(i - 0.5) / services.length, i / services.length, (i + 1) / services.length],
      ["5%", "0%", "-5%"]
    );
  });

  const serviceScale = Array(services.length).fill(0).map((_, i) => {
    return useTransform(
      scrollYProgress,
      [(i - 0.5) / services.length, i / services.length, (i + 1) / services.length],
      [0.8, 1, 0.8]
    );
  });

  // Update active service based on scroll
  useEffect(() => {
    const updateActiveService = () => {
      const scrollPos = scrollYProgress.get();
      const newActiveService = Math.min(
        Math.floor(scrollPos * services.length),
        services.length - 1
      );
      if (newActiveService >= 0) {
        setActiveService(newActiveService);
      }
    };

    const unsubscribe = scrollYProgress.onChange(updateActiveService);
    return () => unsubscribe();
  }, [scrollYProgress]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            entry.target.classList.add('opacity-100');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Card variants for animations
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    }),
    hover: { 
      y: -10,
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  };

  return (
    <section 
      id="capabilities" 
      ref={sectionRef}
      className="py-24 px-6 opacity-0 transition-opacity duration-700 min-h-screen"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-lg font-medium uppercase tracking-widest text-accent/80 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Capabilities
          </motion.h2>
          <motion.h3 
            className="text-4xl md:text-5xl font-bold font-space mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-gradient">What We</span> Build
          </motion.h3>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Our specialized services blend technical expertise with creative innovation to craft digital experiences that exceed expectations.
          </motion.p>
        </div>

        {/* Premium service cards with scroll-based animations */}
        <div className="flex flex-col items-center space-y-20 relative" ref={servicesRef}>
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className="w-full max-w-4xl glass-card group relative"
              style={{
                opacity: serviceOpacity[index],
                y: serviceY[index],
                scale: serviceScale[index],
              }}
              variants={cardVariants}
              initial="initial"
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              custom={index}
              whileHover="hover"
            >
              {/* Indicator of active card */}
              {index === activeService && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-accent rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-accent/10 text-accent">
                      {service.icon}
                    </div>
                    <h4 className="text-2xl font-bold font-space">{service.title}</h4>
                  </div>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  
                  <a 
                    href="#contact"
                    className="mt-auto glass-button inline-flex items-center gap-2 group w-max"
                  >
                    Explore Service
                    <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                  </a>
                </div>
                
                {/* Code snippet */}
                <div className="md:col-span-3 bg-background/80 rounded-lg p-4 font-mono text-sm overflow-x-auto max-h-[200px]">
                  <pre className="text-green-400">
                    {service.codeSample}
                  </pre>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-br-xl border-r-2 border-b-2 border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -top-2 -left-2 w-12 h-12 rounded-tl-xl border-l-2 border-t-2 border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
          
          {/* Connecting line */}
          <div className="absolute left-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent opacity-50"></div>
          
          {/* Scroll position indicator */}
          <motion.div 
            className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.8 }}
          >
            {services.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeService ? 'bg-accent w-3 h-3' : 'bg-muted'
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Connect line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent my-12 opacity-70"></div>

      <style>
        {`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .glass-card.group:hover {
          border-image: linear-gradient(to right, rgba(30,144,255,0.5), rgba(147,112,219,0.5)) 1;
          box-shadow: 0 0 20px rgba(147, 112, 219, 0.2);
        }
        `}
      </style>
    </section>
  );
};

export default Capabilities;
