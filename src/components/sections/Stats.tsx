
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Code, Users, Zap } from 'lucide-react';

interface CounterProps {
  end: number;
  duration?: number;
  label: string;
  icon: React.ReactNode;
  suffix?: string;
  inView: boolean;
}

const Counter = ({ end, duration = 2000, label, icon, suffix = '', inView }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const startAnimation = (timestamp: number) => {
      startTime = timestamp;
      updateCount(timestamp);
    };

    const updateCount = (timestamp: number) => {
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(percentage * end));
      
      if (percentage < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(startAnimation);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, inView]);

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl">
        {icon}
      </div>
      <div className="text-4xl font-bold font-space text-gradient mb-2">
        {count}{suffix}
      </div>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
};

const Stats = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(30,144,255,0.15),transparent_70%),radial-gradient(ellipse_at_bottom_left,rgba(147,112,219,0.15),transparent_70%)]"></div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-accent/10 text-accent text-sm px-4 py-1.5 rounded-full mb-4"
          >
            Our Impact
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4 font-space"
          >
            Driving Digital Excellence
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Our track record of success spans multiple industries and technologies
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Counter 
              end={250} 
              label="Projects Delivered" 
              icon={<Code className="w-8 h-8 text-accent" />}
              inView={inView}
              suffix="+"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Counter 
              end={98} 
              label="Client Satisfaction" 
              icon={<Users className="w-8 h-8 text-accent" />}
              inView={inView}
              suffix="%"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Counter 
              end={12} 
              label="Industry Awards" 
              icon={<Award className="w-8 h-8 text-accent" />}
              inView={inView}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Counter 
              end={5} 
              label="Years Experience" 
              icon={<Zap className="w-8 h-8 text-accent" />}
              inView={inView}
              suffix="+"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Stats;
