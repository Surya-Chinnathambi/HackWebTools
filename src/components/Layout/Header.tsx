
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Github, Search as SearchIcon } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import SearchBar from "../Search/SearchBar";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105 duration-300">
          <div className="bg-primary rounded-full p-1">
            <code className="text-primary-foreground text-sm font-bold">SP</code>
          </div>
          <span className="font-bold text-lg hidden md:inline-block animate-fade-in">SecurePulse</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="transition-colors hover:text-primary relative group">
              Home
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/tools" className="transition-colors hover:text-primary relative group">
              Tools
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/payloads" className="transition-colors hover:text-primary relative group">
              Payloads
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/xss" className="transition-colors hover:text-primary relative group">
              XSS
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <a 
              href="https://github.com/aw-junaid/Hacking-Tools" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="transition-colors hover:text-primary relative group"
            >
              GitHub
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          <div className="hidden lg:block w-[200px] xl:w-[300px]">
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-sm text-muted-foreground" onClick={toggleSearch}>
                  <SearchIcon className="mr-2 h-4 w-4" />
                  <span>Search tools...</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[300px] lg:w-[400px]" align="end">
                <Command>
                  <CommandInput placeholder="Search tools..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      <SearchBar />
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button onClick={toggleMenu} className="p-2 transition-transform hover:scale-110">
            {isMenuOpen ? (
              <X className="h-6 w-6 animate-fade-in" />
            ) : (
              <Menu className="h-6 w-6 animate-fade-in" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu with animation */}
      {isMenuOpen && (
        <div className="md:hidden border-t animate-fade-in">
          <div className="container py-4 flex flex-col gap-4">
            <SearchBar />
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/tools" 
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Tools
              </Link>
              <Link 
                to="/payloads" 
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Payloads
              </Link>
              <Link 
                to="/xss" 
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                XSS
              </Link>
              <a 
                href="https://github.com/Surya-Chinnathambi/HackWebTools"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-base font-medium flex items-center gap-2 transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Github size={16} /> GitHub Repository
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
