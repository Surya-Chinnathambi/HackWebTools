
import { Github, Book, Shield, Code } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-8 bg-background/95 backdrop-blur-sm">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-6 md:h-24">
        <div className="flex flex-col items-center md:items-start animate-fade-in">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            SecurePulse - Professional Security Testing Documentation
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Data sourced from{" "}
            <a 
              href="https://github.com/aw-junaid/Hacking-Tools" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline text-primary transition-colors"
            >
              Surya-Chinnathambi repository
            </a>
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-6">
          <Link
            to="/tools"
            className="text-sm flex items-center gap-2 hover:text-primary transition-all duration-300 hover:translate-x-1"
          >
            <Book size={16} />
            <span>Tools</span>
          </Link>
          
          <Link
            to="/payloads"
            className="text-sm flex items-center gap-2 hover:text-primary transition-all duration-300 hover:translate-x-1"
          >
            <Code size={16} />
            <span>Payloads</span>
          </Link>
          
          <Link
            to="/xss"
            className="text-sm flex items-center gap-2 hover:text-primary transition-all duration-300 hover:translate-x-1"
          >
            <Shield size={16} />
            <span>XSS</span>
          </Link>
          
          <a
            href="https://github.com/Surya-Chinnathambi/HackWebTools"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm flex items-center gap-2 hover:text-primary transition-all duration-300 hover:translate-x-1"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
