
import React, { useEffect, useRef, useState } from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    quote: "Launchory transformed our outdated platform into a cutting-edge digital experience that our customers love. Their attention to detail is unparalleled.",
    name: "Alex Morgan",
    title: "CTO, TechVision",
    avatar: "https://placehold.co/100/1a1f2c/FFFFFF?text=AM",
    rating: 5
  },
  {
    id: 2,
    quote: "Working with Launchory has been a game-changer for our startup. They not only built our MVP but provided strategic insights that shaped our product roadmap.",
    name: "Samantha Lee",
    title: "Founder, InnovateX",
    avatar: "https://placehold.co/100/1a1f2c/FFFFFF?text=SL",
    rating: 5
  },
  {
    id: 3,
    quote: "The team at Launchory delivered a complex web application ahead of schedule. Their technical expertise and project management were exceptional.",
    name: "David Chen",
    title: "Product Manager, DataFlow",
    avatar: "https://placehold.co/100/1a1f2c/FFFFFF?text=DC",
    rating: 5
  },
  {
    id: 4,
    quote: "Launchory's ability to translate our vision into a functional, beautiful web experience exceeded our expectations. They're true partners in our success.",
    name: "Emma Wilson",
    title: "Marketing Director, GrowthLabs",
    avatar: "https://placehold.co/100/1a1f2c/FFFFFF?text=EW",
    rating: 5
  },
  {
    id: 5,
    quote: "The Launchory team built our SaaS platform with scalability in mind. We've grown 10x and our infrastructure hasn't skipped a beat.",
    name: "Michael Torres",
    title: "CEO, ScaleUp Solutions",
    avatar: "https://placehold.co/100/1a1f2c/FFFFFF?text=MT",
    rating: 5
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      const handleScroll = () => {
        const scrollPosition = scrollElement.scrollLeft;
        const itemWidth = scrollElement.scrollWidth / testimonials.length;
        const currentIndex = Math.round(scrollPosition / itemWidth);
        if (currentIndex !== activeIndex) {
          setActiveIndex(currentIndex);
        }
      };
      
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [activeIndex]);

  const testimonialVariants = {
    initial: { opacity: 0, y: 20, rotateX: 45, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1.2
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      rotateX: -45,
      scale: 0.9,
      transition: {
        duration: 0.4,
        ease: "anticipate"
      }
    },
    hover: {
      y: -12,
      scale: 1.03,
      rotateY: 5,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className="py-12 md:py-24 px-4 md:px-6 opacity-0 transition-opacity duration-700 relative overflow-hidden"
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 opacity-50"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
          scale: [1, 1.1, 1],
          filter: ['blur(30px)', 'blur(20px)', 'blur(30px)']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
      
      {/* Premium floating orbs */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 rounded-full bg-accent/10 blur-3xl"
        animate={{
          y: [-20, 20],
          x: [-10, 10],
          scale: [0.9, 1.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl"
        animate={{
          y: [20, -20],
          x: [10, -10],
          scale: [1.1, 0.9]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />

      <div className="container mx-auto relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-lg font-medium uppercase tracking-widest text-accent/80 mb-4 relative inline-flex items-center gap-2">
            <span className="animate-pulse-slow">★</span> Success Stories <span className="animate-pulse-slow">★</span>
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold font-space mb-6 relative">
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-accent via-accent-light to-accent animate-gradient-x">Trusted by</span>
            <br className="md:hidden" />
            <span className="relative inline-block">
              Innovative Companies
              <div className="absolute -inset-2 bg-accent/5 blur-2xl opacity-50 rounded-full animate-pulse-slow"></div>
            </span>
            <div className="absolute -top-8 -right-8 text-xs font-normal bg-accent/20 backdrop-blur-lg px-3 py-1.5 rounded-full animate-float-slow shadow-lg border border-accent/30">
              <span className="mr-1">⭐</span> Premium Quality
            </div>
            <div className="absolute -bottom-8 -left-8 text-xs font-normal bg-accent/20 backdrop-blur-lg px-3 py-1.5 rounded-full animate-float-slow shadow-lg border border-accent/30" style={{ animationDelay: "1s" }}>
              <span className="mr-1">💎</span> Elite Service
            </div>
          </h3>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg md:text-xl leading-relaxed relative z-10">
            Experience the transformative power of our expertise. We've helped forward-thinking businesses
            <span className="text-accent font-medium"> revolutionize their digital presence</span> and
            <span className="text-gradient font-medium"> achieve extraordinary results</span>.
          </p>
        </motion.div>

        <div className="relative">
          <motion.div 
            className="absolute -top-20 left-10 text-6xl font-bold text-accent/5 select-none"
            animate={{ y: [-10, 10], opacity: [0.3, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
          >
            Excellence
          </motion.div>
          <motion.div 
            className="absolute -bottom-10 right-10 text-6xl font-bold text-accent/5 select-none"
            animate={{ y: [10, -10], opacity: [0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
          >
            Innovation
          </motion.div>
          <motion.div 
            className="absolute top-1/2 left-1/3 text-6xl font-bold text-accent/5 select-none"
            animate={{ scale: [0.95, 1.05], opacity: [0.3, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', delay: 2 }}
          >
            Quality
          </motion.div>
          
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (scrollRef.current) {
                  const itemWidth = scrollRef.current.scrollWidth / testimonials.length;
                  const newIndex = Math.max(0, activeIndex - 1);
                  scrollRef.current.scrollTo({ 
                    left: newIndex * itemWidth, 
                    behavior: 'smooth' 
                  });
                }
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-accent/10 backdrop-blur-sm border border-accent/20 flex items-center justify-center text-accent hover:bg-accent/20 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
            >
              <ArrowLeft size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (scrollRef.current) {
                  const itemWidth = scrollRef.current.scrollWidth / testimonials.length;
                  const newIndex = Math.min(testimonials.length - 1, activeIndex + 1);
                  scrollRef.current.scrollTo({ 
                    left: newIndex * itemWidth, 
                    behavior: 'smooth' 
                  });
                }
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-accent/10 backdrop-blur-sm border border-accent/20 flex items-center justify-center text-accent hover:bg-accent/20 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
            >
              <ArrowRight size={20} />
            </motion.button>

            <div 
              ref={scrollRef}
              className="flex overflow-x-auto py-4 md:py-8 px-2 md:px-4 gap-4 md:gap-6 snap-x snap-mandatory hide-scrollbar touch-pan-x"
            >
              <AnimatePresence mode="wait">
                {testimonials.map((testimonial, index) => (
                  <motion.div 
                    key={testimonial.id}
                    whileHover="hover"
                    variants={testimonialVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="glass snap-center flex-shrink-0 w-[85%] sm:w-[75%] md:w-[60%] lg:w-[45%] rounded-2xl p-4 md:p-6 lg:p-8 transition-all duration-300 backdrop-blur-xl bg-background/30 border border-accent/20 hover:shadow-2xl hover:shadow-accent/30 perspective-1000 transform-gpu hover:border-accent/40 relative overflow-hidden group"
                    style={{
                      scrollSnapAlign: 'center',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Premium background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent/10 to-accent-light/10 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    <motion.div 
                      className="flex mb-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {Array(5).fill(null).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star 
                            size={16} 
                            className={i < testimonial.rating ? 'fill-accent text-accent' : 'text-muted'} 
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    <motion.blockquote 
                      className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 font-light"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      "{testimonial.quote}"
                    </motion.blockquote>
                    
                    <motion.div 
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="relative group">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <motion.div 
                          className="absolute inset-0 border-2 border-accent rounded-full"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold font-space">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
          
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-accent scale-125' : 'bg-muted hover:bg-accent/50'
              }`}
              onClick={() => {
                if (scrollRef.current) {
                  const itemWidth = scrollRef.current.scrollWidth / testimonials.length;
                  scrollRef.current.scrollTo({ 
                    left: index * itemWidth, 
                    behavior: 'smooth' 
                  });
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
