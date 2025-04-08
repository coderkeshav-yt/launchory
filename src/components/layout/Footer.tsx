
import React, { useEffect, useState, useRef } from 'react';
import { Terminal, Twitter, Linkedin, Mail, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const [visible, setVisible] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  const lines = [
    '> Initializing Launchory terminal...',
    '> Loading design system components...',
    '> Establishing connection...',
    '> Welcome to Launchory',
    '> © 2025 Launchory. All rights reserved.',
    '> Type "help" for available commands',
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (terminalRef.current) {
      observer.observe(terminalRef.current);
    }

    return () => {
      if (terminalRef.current) observer.unobserve(terminalRef.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setTerminalLines((prev) => {
            if (prev.length < lines.length) {
              return [...prev, lines[prev.length]];
            } else {
              clearInterval(interval);
              return prev;
            }
          });
        }, 300);

        return () => clearInterval(interval);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  return (
    <footer className="relative py-24 px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold font-space text-gradient mb-6">Launchory</h3>
            <p className="text-muted-foreground max-w-md mb-8">
              Next-generation web development agency crafting premium digital experiences for forward-thinking brands.
            </p>
            <div className="flex gap-5">
              <a href="https://x.com/launchorywebdev" className="p-3 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 hover:from-[#1DA1F2]/30 hover:to-[#1DA1F2]/15 transition-all duration-300 text-accent hover:text-[#1DA1F2] hover:scale-110 hover:shadow-[0_0_15px_rgba(29,161,242,0.4)] group">
                <Twitter size={20} className="transform group-hover:rotate-12 transition-all duration-300" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="p-3 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 hover:from-[#0A66C2]/30 hover:to-[#0A66C2]/15 transition-all duration-300 text-accent hover:text-[#0A66C2] hover:scale-110 hover:shadow-[0_0_15px_rgba(10,102,194,0.4)] group">
                <Linkedin size={20} className="transform group-hover:rotate-12 transition-all duration-300" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://www.youtube.com/@Lauchory 
" className="p-3 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 hover:from-[#FF0000]/30 hover:to-[#FF0000]/15 transition-all duration-300 text-accent hover:text-[#FF0000] hover:scale-110 hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] group">
                <Youtube size={20} className="transform group-hover:rotate-12 transition-all duration-300" />
                <span className="sr-only">YouTube</span>
              </a>
              <a href="https://www.instagram.com/launchory/" className="p-3 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 hover:from-[#E4405F]/30 hover:to-[#E4405F]/15 transition-all duration-300 text-accent hover:text-[#E4405F] hover:scale-110 hover:shadow-[0_0_15px_rgba(228,64,95,0.4)] group">
                <Instagram size={20} className="transform group-hover:rotate-12 transition-all duration-300" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="mailto:launchory@gmail.com" className="p-3 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 hover:from-[#EA4335]/30 hover:to-[#EA4335]/15 transition-all duration-300 text-accent hover:text-[#EA4335] hover:scale-110 hover:shadow-[0_0_15px_rgba(234,67,53,0.4)] group">
                <Mail size={20} className="transform group-hover:rotate-12 transition-all duration-300" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
          
          <div 
            ref={terminalRef}
            className="glass rounded-lg p-4 font-mono text-sm text-green-400 overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-4">
              <Terminal size={16} />
              <span className="text-xs text-muted-foreground">Terminal</span>
            </div>
            <div className="space-y-2">
              {terminalLines.map((line, i) => (
                <div 
                  key={i} 
                  className="animate-fade-in" 
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  {line}
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="text-accent">guest@launchory:~$</span>
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-muted text-center">
          <p className="text-sm text-muted-foreground">
            <span className="block mb-2">
              Press: Shift+C for Contact, Shift+D for Work, L for Page Info
            </span>
            © 2025 Launchory. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
      <div className="absolute bottom-24 left-1/4 w-24 h-24 rounded-full bg-neon-blue/10 blur-2xl"></div>
      <div className="absolute bottom-12 right-1/5 w-32 h-32 rounded-full bg-neon-purple/10 blur-2xl"></div>
    </footer>
  );
};

export default Footer;
