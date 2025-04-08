
import React from 'react';
import { Loader, Code, ArrowLeft, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const BuildingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <motion.div 
            className="glass-card bg-background/70 p-10 text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="inline-flex mb-8 p-5 rounded-full bg-accent/10"
              animate={{ 
                rotate: 360,
                transition: { duration: 2, repeat: Infinity, ease: "linear" }
              }}
            >
              <Loader className="h-16 w-16 text-accent" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Website Under Construction
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're working hard to bring you something amazing. This project is currently in development and will be available soon.
            </p>
            
            <div className="flex justify-center mb-10">
              <div className="relative overflow-hidden w-full max-w-md h-3 bg-muted rounded-full">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent"
                  animate={{
                    x: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ width: "30%" }}
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <motion.div 
                className="glass-card p-6 text-center max-w-xs"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Clock className="h-10 w-10 text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  Our team is working diligently to complete this website. We'll be launching soon!
                </p>
              </motion.div>
              
              <motion.div 
                className="glass-card p-6 text-center max-w-xs"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <AlertCircle className="h-10 w-10 text-accent mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
                <p className="text-muted-foreground">
                  Want to be notified when we launch? Contact us to join our mailing list.
                </p>
              </motion.div>
            </div>
            
            <div className="mt-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                  size="lg"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Projects
                </Button>
              </motion.div>
            </div>
          </motion.div>
          
          <div className="text-center text-muted-foreground">
            <p>© 2025 All Rights Reserved</p>
            <p className="text-sm mt-1">Need more information? <Link to="/contact" className="text-accent hover:underline">Contact Us</Link></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BuildingPage;
