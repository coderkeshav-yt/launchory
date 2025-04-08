
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Mission from '@/components/sections/Mission';
import Capabilities from '@/components/sections/Capabilities';
import Projects from '@/components/sections/Projects';
import Testimonials from '@/components/sections/Testimonials';
import Contact from '@/components/sections/Contact';
import FloatingAIButton from '@/components/ai/FloatingAIButton';
import KeyboardCommands from '@/components/utils/KeyboardCommands';
import ClientsLogos from '@/components/sections/ClientsLogos';
import Stats from '@/components/sections/Stats';

const Index = () => {
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <KeyboardCommands setCalculatorOpen={setCalculatorOpen} />
      <Header />
      <main>
        <Hero />
        <ClientsLogos />
        <Mission />
        <Capabilities />
        <Stats />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingAIButton />
    </div>
  );
};

export default Index;
