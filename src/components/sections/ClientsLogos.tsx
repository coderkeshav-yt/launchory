
import { useInView } from 'react-intersection-observer';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// Project highlights with real metrics and testimonials
const projects = [
  {
    name: "E-Commerce ",
    metric: "+187%",
    metricLabel: "Revenue Growth",
    quote: "Transformed our entire digital presence",
    image: "/Banner-uploads/ECommerce.jpg",
    category: "Digital Commerce"
  },
  {
    name: "AI-Powered Analytics",
    metric: "62%",
    metricLabel: "Efficiency Increase",
    quote: "Game-changing insights automation",
    image: "/Banner-uploads/AI Powered.jpg",
    category: "Machine Learning"
  },
  {
    name: "Cloud Infrastructure",
    metric: "4.2M",
    metricLabel: "Daily Active Users",
    quote: "Seamless scaling at enterprise level",
    image: "/Banner-uploads/Cloud Infrastructure.jpg",
    category: "Cloud Solutions"
  },
  {
    name: "Mobile Experience",
    metric: "+92%",
    metricLabel: "User Engagement",
    quote: "Exceptional user experience design",
    image: "/Banner-uploads/Mobile Experience.jpg",
    category: "Mobile Apps"
  },
  {
    name: "Digital Transformation",
    metric: "$2.5M",
    metricLabel: "Cost Savings",
    quote: "Complete digital transformation success",
    image: "/Banner-uploads/Digital Transformation.jpg",
    category: "Enterprise Solutions"
  },
];


const ClientsLogos = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // Handle smooth scrolling
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = 300;
    const targetScroll = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(
          scrollPosition + scrollAmount,
          container.scrollWidth - container.clientWidth
        );
  
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  
    setScrollPosition(targetScroll);
  };

  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30, rotateX: -20, rotateY: -15 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.8,
        velocity: 2
      }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background"
    >
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] opacity-40"/>
      <div 
        className="absolute inset-0 bg-gradient-conic from-accent/10 via-primary/10 to-accent/10 opacity-30"
        style={{ transform: `translateY(${backgroundY})` }}
      />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-accent/20 to-transparent rounded-full blur-3xl"
        style={{
          x: mousePos.x * 30,
          y: mousePos.y * 30,
          opacity
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-l from-primary/20 to-transparent rounded-full blur-3xl"
        style={{
          x: mousePos.x * -30,
          y: mousePos.y * -30,
          opacity
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          ref={ref}
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="inline-block text-sm font-medium text-accent/90 bg-accent/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Success Stories
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-space">
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-accent via-primary to-accent">
              Real Impact, Real Results
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover how we've helped businesses achieve extraordinary digital transformations
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-accent via-primary to-accent mx-auto rounded-full"></div>
        </motion.div>
        
        <div className="relative overflow-x-auto pb-12 -mx-6 px-6">
          <button 
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm p-2 rounded-full border border-border/50 shadow-lg hover:bg-accent/5 transition-all duration-300 group"
            style={{ transform: `translate(-50%, -50%) ${scrollPosition <= 0 ? 'scale(0.8) opacity(0.5)' : ''}` }}
          >
            <svg className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm p-2 rounded-full border border-border/50 shadow-lg hover:bg-accent/5 transition-all duration-300 group"
          >
            <svg className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div 
            ref={scrollContainerRef}
            className="flex space-x-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory'
            }}
            onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.name}
                variants={itemVariants}
                className="group relative w-[300px] h-[400px] perspective-[2000px] cursor-pointer flex-shrink-0 snap-center"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                  z: 50,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent group-hover:from-white/20 group-hover:via-white/10 group-hover:to-transparent backdrop-blur-xl rounded-2xl border border-white/20 opacity-100 transition-all duration-700 shadow-[0_8px_32px_rgba(0,0,0,0.15)] group-hover:shadow-[0_24px_64px_rgba(0,0,0,0.25)] group-hover:border-white/30 overflow-hidden">
                  {/* Enhanced ambient lighting effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.accent.DEFAULT/0.15),theme(colors.primary.DEFAULT/0.05))] opacity-0 group-hover:opacity-100 transition-all duration-700 blur-lg"></div>
                  
                  {/* Add shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-all duration-1000 ease-in-out"></div>
                  
                  {/* Content container */}
                  <div className="relative h-full p-6 flex flex-col">
                    {/* Rest of the content remains the same */}
                    {/* Category tag */}
                    <span className="inline-block text-xs font-medium text-accent/90 bg-accent/10 px-3 py-1 rounded-full backdrop-blur-sm border border-accent/10 mb-4">
                      {project.category}
                    </span>
                    
                    {/* Project image */}
                    <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                    </div>
                    
                    {/* Project details */}
                    <h3 className="text-xl font-bold mb-2 font-space">{project.name}</h3>
                    
                    {/* Metric */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-bold text-accent">{project.metric}</span>
                      <span className="text-sm text-muted-foreground">{project.metricLabel}</span>
                    </div>
                    
                    {/* Quote */}
                    <blockquote className="text-sm text-muted-foreground italic">
                      "{project.quote}"
                    </blockquote>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
          
          {/* Scroll indicators */}
          <div className="absolute left-0 right-0 bottom-0 flex justify-center gap-2 mt-6">
            <div className="w-12 h-1 rounded-full bg-accent/30"></div>
            <div className="w-12 h-1 rounded-full bg-accent/10"></div>
            <div className="w-12 h-1 rounded-full bg-accent/10"></div>
          </div>
        </div>
    </section>
  );
};

export default ClientsLogos;
