
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, Code, Zap, Globe, Award, Trophy } from 'lucide-react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

const morphingWords = ["Brands", "Platforms", "Commerce", "Interfaces", "Experiences"];

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();

  // Particle system setup
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    velocity: Math.random() * 0.5 + 0.2
  }));

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % morphingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!titleRef.current) return;
      const scrollY = window.scrollY;
      const opacity = Math.max(1 - scrollY / 500, 0.2);
      const scale = Math.max(1 - scrollY / 2000, 0.98);
      
      titleRef.current.style.opacity = opacity.toString();
      titleRef.current.style.transform = `scale(${scale})`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Premium badges with animation
  const badges = [
    { icon: <Globe size={14} />, text: "Global Impact" },
    { icon: <Award size={14} />, text: "Award Winner" },
    { icon: <Trophy size={14} />, text: "Top Rated" }
  ];

  return (
    <section 
      id="home" 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center p-6 md:p-12 overflow-hidden"
    >
      {/* Premium abstract background with layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a192f] via-[#20134e] to-[#301934] opacity-90"></div>
      
      {/* Floating tech particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-accent/30 rounded-full"
          animate={{
            x: [`${particle.x}%`, `${particle.x + 10}%`],
            y: [`${particle.y}%`, `${particle.y - 20}%`],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 3 / particle.velocity,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{
            width: particle.size,
            height: particle.size
          }}
        />
      ))}
      
      {/* 3D Grid Background with enhanced depth */}
      <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] opacity-20">
        {[...Array(400)].map((_, i) => (
          <div 
            key={i} 
            className="border-[0.5px] border-accent/5"
            style={{
              transform: `translateZ(${Math.sin(i * 0.1) * 20}px)`,
              opacity: (i % 3 === 0) ? 0.2 : 0.05,
            }}
          />
        ))}
      </div>
      
      {/* Animated gradient orbs with parallax effect */}
      <div 
        className="absolute inset-0 bg-gradient-radial opacity-60"
        style={{
          background: 'radial-gradient(circle at center, rgba(30,144,255,0.15) 0%, rgba(0,0,0,0) 70%)',
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          transition: 'transform 0.2s ease',
        }}
      />
      
      {/* Hero content */}
      <motion.div 
        className="container mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <div className="flex flex-col items-center justify-center text-center">
          {/* Premium badge banner */}
          <motion.div 
            className="mb-6 flex gap-4 flex-wrap justify-center"
            variants={itemVariants}
          >
            {badges.map((badge, index) => (
              <motion.span 
                key={index}
                className="text-xs font-medium text-accent/90 bg-accent/10 backdrop-blur-sm px-4 py-1.5 rounded-full flex items-center gap-2 border border-accent/20"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (index * 0.2) }}
              >
                <span className="animate-pulse-glow">{badge.icon}</span>
                {badge.text}
              </motion.span>
            ))}
          </motion.div>
          

          
          {/* Title with enhanced styling */}
          <motion.h1 
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 font-space"
            variants={itemVariants}
          >
            <span className="block text-white mb-2">We Create</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWordIndex}
                className="block text-gradient bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {morphingWords[currentWordIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.h1>
          
          {/* Enhanced subheading */}
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-6 font-light leading-relaxed"
            variants={itemVariants}
          >
            <span className="text-foreground font-medium">Launchory:</span> A boutique team crafting premium, innovative web applications for brands.
          </motion.p>
          
          {/* Social proof element with enhanced design */}
          <motion.div 
            className="mb-10 relative group overflow-hidden bg-gradient-to-r from-accent/5 via-background/60 to-accent/5 backdrop-blur-md px-8 py-4 rounded-full border border-accent/20 shadow-xl hover:shadow-2xl hover:border-accent/30 transition-all duration-500 max-w-sm mx-auto"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
            
            {/* Content with enhanced typography */}
            <div className="relative flex items-center justify-center gap-2">
              <span className="text-sm md:text-base font-medium">
                <span className="text-accent font-bold">Trusted by 250+</span>
                <span className="mx-1 text-muted-foreground">brands across</span>
                <span className="text-accent font-bold">25+</span>
                <span className="text-muted-foreground">countries</span>
              </span>
            </div>
          </motion.div>
          
          {/* Enhanced CTA section */}
          <motion.div 
            className="flex flex-col md:flex-row gap-6 items-center"
            variants={itemVariants}
          >
            <a 
              href="/get-started" 
              className="glass-button group flex items-center gap-3 overflow-hidden relative shadow-lg border border-white/10 px-8 py-4 rounded-full"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-blue to-neon-purple opacity-0 group-hover:opacity-20 transition-opacity"></span>
              <span className="relative z-10 text-lg">Launch Your Vision</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </a>
            <a 
              href="#capabilities" 
              className="glass-button-secondary group flex items-center gap-3 overflow-hidden relative px-8 py-4 rounded-full bg-accent/5 border border-accent/20 hover:bg-accent/10 hover:border-accent/30 transition-all duration-300"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent/5 to-primary/5 opacity-0 group-hover:opacity-20 transition-opacity"></span>
              <span className="relative z-10">Discover Our Capabilities</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" size={20} />
            </a>
          </motion.div>
          
          {/* Social proof element - removed from here as it's now integrated into the main content flow */}
        </div>
      </motion.div>
      
      {/* Premium floating elements with enhanced parallax effect */}
      <div 
        className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-radial from-neon-blue/30 to-transparent rounded-full blur-3xl"
        style={{
          transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
          transition: 'transform 0.6s ease',
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-neon-purple/30 to-transparent rounded-full blur-3xl"
        style={{
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          transition: 'transform 0.8s ease',
        }}
      />

      {/* Premium animated particles */}
      <div className="absolute inset-0 z-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-accent/70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: mousePos.x * (i + 5) * 2,
              y: mousePos.y * (i + 5) * 2,
              scale: [1, 1.5, 1],
              opacity: [0.1 + Math.random() * 0.5, 0.5, 0.1 + Math.random() * 0.5]
            }}
            transition={{
              duration: 2 + i * 0.2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
      
      {/* Premium 3D geometric shapes */}
      <div className="absolute top-[20%] right-[15%] w-32 h-32 opacity-20 hidden md:block">
        <div className="absolute w-full h-full border border-accent/20 rounded-lg transform rotate-45 animate-spin-slow"></div>
        <div className="absolute w-full h-full border border-accent/30 rounded-lg transform -rotate-45 animate-spin-reverse-slow"></div>
      </div>
      <div className="absolute bottom-[25%] left-[15%] w-24 h-24 opacity-20 hidden md:block">
        <div className="absolute w-full h-full border border-accent/30 rounded-full animate-pulse"></div>
        <div className="absolute w-3/4 h-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-accent/20 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>
    </section>
  );
};

export default Hero;

