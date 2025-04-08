
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Rocket, Compass } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const timelineItems = [
  {
    year: "2023",
    title: "Foundation",
    description: "Launchory was established with a vision to create premium web experiences.",
    icon: <Calendar className="text-accent" size={24} />
  },
  {
    year: "Now",
    title: "Innovation",
    description: "Leading the industry with cutting-edge web development techniques and technologies.",
    icon: <Rocket className="text-accent" size={24} />
  },
  {
    year: "Future",
    title: "Evolution",
    description: "Constantly pushing boundaries and redefining what's possible in web development.",
    icon: <Compass className="text-accent" size={24} />
  }
];

const Mission = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });
  
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            if (entry.target === sectionRef.current) {
              setIsVisible(true);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    cardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      cardsRef.current.forEach(card => {
        if (card) observer.unobserve(card);
      });
      if (timelineRef.current) observer.unobserve(timelineRef.current);
    };
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <section 
      id="mission" 
      ref={sectionRef} 
      className="py-24 px-6 opacity-0 translate-y-10 transition-all duration-700"
    >
      <div className="container mx-auto relative">
        <div className="text-center mb-20">
          <motion.h2 
            className="text-lg font-medium uppercase tracking-widest text-accent/80 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Our Mission
          </motion.h2>
          <motion.h3 
            className="text-4xl md:text-5xl font-bold font-space mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-gradient">Engineered</span> for the Future
          </motion.h3>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            We combine technical excellence with creative vision to build web experiences that stand out in today's digital landscape.
          </motion.p>
        </div>

        {/* Modular cards with staggered animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {[
            {
              title: "Pixel-Perfect Design",
              description: "Every pixel matters. We craft interfaces with meticulous attention to detail and visual harmony.",
              from: "-translate-x-20",
              delay: "100ms"
            },
            {
              title: "Performance-First",
              description: "Blazing fast loading times and smooth interactions are non-negotiable in our development process.",
              from: "translate-y-20",
              delay: "300ms"
            },
            {
              title: "Future-Proof Technology",
              description: "We utilize modern frameworks and tools that scale with your business and adapt to future needs.",
              from: "translate-x-20",
              delay: "500ms"
            }
          ].map((card, i) => (
            <motion.div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className="glass-card opacity-0 transition-all duration-700"
              variants={cardVariants}
              initial="hidden"
              custom={i}
              animate={isVisible ? "visible" : "hidden"}
              whileHover={{ 
                y: -10,
                boxShadow: "0 10px 25px rgba(147, 112, 219, 0.2)"
              }}
            >
              <h4 className="text-xl font-bold mb-4 font-space">{card.title}</h4>
              <p className="text-muted-foreground">{card.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline section with real-time scroll progress */}
        <motion.div 
          ref={timelineRef}
          className="opacity-0 translate-y-10 transition-all duration-700 delay-700 relative"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1, translateY: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-center text-3xl font-bold font-space mb-12">Our Journey</h3>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line with progress indicator */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-accent/20 via-accent/20 to-transparent"></div>
            
            {/* Animated progress overlay */}
            <motion.div 
              className="absolute left-1/2 transform -translate-x-1/2 w-1.5 bg-gradient-to-b from-accent via-accent to-accent/50 rounded-full origin-top"
              style={{ height: progressHeight }}
            />
            
            {/* Timeline items */}
            <div className="space-y-32">
              {timelineItems.map((item, index) => (
                <motion.div 
                  key={index}
                  className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
                >
                  {/* Timeline point with 3D effect */}
                  <motion.div 
                    className="absolute left-1/2 transform -translate-x-1/2 z-10 w-16 h-16 rounded-full glass flex items-center justify-center border border-accent/30"
                    whileHover={{ 
                      scale: 1.2,
                      boxShadow: "0 0 15px rgba(147, 112, 219, 0.5)",
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      rotate: { duration: 0.5, repeat: 0 }
                    }}
                  >
                    {item.icon}
                  </motion.div>
                  
                  <motion.div 
                    className={`w-1/2 ${index % 2 === 0 ? 'text-right pr-16' : 'pl-16'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? {
                      opacity: 1,
                      y: 0,
                      transition: { delay: 1 + index * 0.3 }
                    } : {}}
                  >
                    <span className="text-accent font-bold text-2xl block mb-2">{item.year}</span>
                    <h4 className="text-xl font-bold font-space mb-2">{item.title}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </motion.div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>

            {/* Timeline decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-accent/30 animate-pulse-glow"
                  style={{
                    left: `${15 + Math.random() * 70}%`,
                    top: `${10 + (i * 20) + Math.random() * 10}%`,
                    animationDelay: `${i * 0.5}s`
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Mission;
