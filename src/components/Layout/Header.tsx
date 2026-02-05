
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Github, Search as SearchIcon, ChevronDown, Shield, Code, Zap, BookOpen, Target, BarChart3 } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import SearchBar from "../Search/SearchBar";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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

        <div className="hidden lg:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  <Shield className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/dashboard" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 text-sm font-medium transition-all hover:shadow-lg hover:scale-105 focus:outline-none">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm">
                  <Zap className="mr-2 h-4 w-4" />
                  Security Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/tools" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">All Tools</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Browse complete toolkit
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/advanced-vuln-scanner" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">VAPT Scanner</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Real CVE vulnerability detection
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/threat-intelligence" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">AI Threat Intel</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            ML-powered threat detection
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/api-security-tester" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">API Security</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            REST/GraphQL testing
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm">
                  <Code className="mr-2 h-4 w-4" />
                  Utilities
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/payloads" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Payloads</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            XSS, SQLi, fuzzing wordlists
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/encoder-decoder" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Encoder/Decoder</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Base64, URL, Hex encoding
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/reverse-shell" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Reverse Shells</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Multi-language shell generator
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/command-generator" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Commands</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Pentest command templates
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm">
                  <Target className="mr-2 h-4 w-4" />
                  Testing
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/xss-tester" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">XSS Tester</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Cross-site scripting analysis
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/owasp-lab" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">OWASP Lab</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Interactive vulnerability training
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/report-generator" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Report Generator</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Professional pentest reports
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Learn
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/learning-hub" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Learning Hub</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            30-day roadmap & career guidance
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/owasp-lab" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">OWASP Lab</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Interactive vulnerability training
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-3">
            <div className="hidden xl:block w-[250px]">
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-sm text-muted-foreground" onClick={toggleSearch}>
                    <SearchIcon className="mr-2 h-4 w-4" />
                    <span>Search...</span>
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

            <Button variant="ghost" size="icon" asChild className="hidden lg:flex">
              <a href="https://github.com/aw-junaid/Hacking-Tools" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>

            <ThemeToggle />
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="p-2 transition-transform hover:scale-110"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 animate-fade-in" />
            ) : (
              <Menu className="h-6 w-6 animate-fade-in" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu backdrop overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu with animation */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden border-t animate-fade-in relative z-50 bg-background shadow-lg"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="container py-6 flex flex-col gap-3">
            <SearchBar />
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-base font-medium bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-md transition-all hover:shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                📊 Dashboard
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
                to="/payload-history"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                History & Favorites
              </Link>
              <Link
                to="/encoder-decoder"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Encoder/Decoder
              </Link>
              <Link
                to="/reverse-shell"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Reverse Shell Generator
              </Link>
              <Link
                to="/command-generator"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Command Generator
              </Link>
              <Link
                to="/xss-tester"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                XSS Tester
              </Link>
              <Link
                to="/report-generator"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Report Generator
              </Link>
              <Link
                to="/exploit-db"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Exploit Database
              </Link>
              <Link
                to="/wordlist-generator"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Wordlist Generator
              </Link>
              <Link
                to="/api-security-tester"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                API Security Tester
              </Link>
              <Link
                to="/port-scanner"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Port Scanner
              </Link>
              <Link
                to="/hash-cracker"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Hash Cracker
              </Link>
              <Link
                to="/learning-hub"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                📚 Learning Hub
              </Link>
              <Link
                to="/owasp-lab"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                OWASP Top 10 Lab
              </Link>
              <Link
                to="/advanced-vuln-scanner"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Advanced Vuln Scanner
              </Link>
              <Link
                to="/threat-intelligence"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                AI Threat Intelligence
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
