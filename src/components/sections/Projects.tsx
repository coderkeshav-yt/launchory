import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ExternalLink, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Project component to display each project
const Project = ({ title, description, image, link, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="h-full"
    >
      <Card 
        className="overflow-hidden bg-gradient-to-br from-card/80 to-card border-border/40 shadow-lg h-full group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
        
        {/* Featured tag */}
        {index === 0 && (
          <div className="absolute top-0 right-0 bg-accent/90 text-white text-xs font-medium px-3 py-1 flex items-center gap-1 rounded-bl-lg z-20">
            <Star className="h-3 w-3" />
            Featured
          </div>
        )}
        
        <div className="relative h-52 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
          <img 
            src={image || "https://placehold.co/600x400/1a1f2c/FFFFFF?text=Project"} 
            alt={title} 
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          
          <div className="absolute bottom-0 left-0 m-4 z-20">
            <span className="inline-block bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md">
              {index % 2 === 0 ? 'Web Application' : 'Mobile Platform'}
            </span>
          </div>
        </div>
        
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="font-space text-gradient text-xl group-hover:bg-gradient-to-r group-hover:from-accent group-hover:to-primary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{title}</CardTitle>
          <CardDescription className="text-muted-foreground/80">{description}</CardDescription>
        </CardHeader>
        
        <CardFooter className="pt-0 flex justify-end relative z-10">
          <a 
            href={link} 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 transition-colors font-medium group/link"
          >
            View Project
            <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
          </a>
        </CardFooter>
        
        {/* Animated border effect */}
        <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/30 rounded-lg transition-all duration-500"></div>
      </Card>
    </motion.div>
  );
};

const projectsData = [
  {
    title: 'Premium Coaching Portals',
    description: 'Helping tutors build strong online presence with smart, custom websites',
    image: '/images/project1.jpg',
    link: 'https://enrollify-nine.vercel.app/',
  },
  {
    title: 'Elite Fitness Portals',
    description: ' Premium websites built to power modern gyms and elite fitness brands.',
    image: '/images/project2.jpg',
    link: 'https://gymweb-zeta.vercel.app/',},
  {
    title: 'E-Commernce  Ecosystem',
    description: 'Helping businesses sell smarter with optimized, user-friendly online stores.',
    image: '/images/project3.jpg',
    link: 'https://coderkeshav-yt.github.io/Bookore/',
  },
];

function Projects() {
  const [isVisible, setIsVisible] = useState(false);

  const { ref } = useInView({
    threshold: 0.2,
    triggerOnce: true,
    onChange: (inView) => {
      if (inView) {
        setIsVisible(true);
      }
    },
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background to-background/80 z-[-1]"></div>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(30,144,255,0.5),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(147,112,219,0.5),transparent_40%)]"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          className="flex flex-col items-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="relative mb-2">
            <span className="inline-block bg-accent/10 backdrop-blur-sm text-accent text-xs font-medium px-4 py-1.5 rounded-full">
              Our Portfolio
            </span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-4 font-space text-gradient"
          >
            Featured Projects
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl text-center"
          >
            Explore our innovative solutions that push the boundaries of technology
          </motion.p>
          
          {/* Decorative elements */}
          <motion.div
            className="absolute top-10 left-1/4 w-32 h-32 bg-accent/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.2, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <motion.div
            className="absolute bottom-10 right-1/4 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 10,
              delay: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projectsData.map((project, index) => (
            <Project
              key={index}
              title={project.title}
              description={project.description}
              image={project.image}
              link={project.link}
              index={index}
            />
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild variant="default" size="lg" className="group relative overflow-hidden">
            <Link to="/projects" className="flex items-center gap-2">
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              <span className="absolute inset-0 translate-y-[105%] bg-secondary text-secondary-foreground flex items-center justify-center group-hover:translate-y-0 transition-transform duration-300">
                <span>Explore Our Work</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Projects;
