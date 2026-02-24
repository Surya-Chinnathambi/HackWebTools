
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Github, Search as SearchIcon, ChevronDown, Shield, Code, Zap, BookOpen, Target, BarChart3, Award, UserCircle, LogOut, CreditCard, Settings, User } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import SearchBar from "../Search/SearchBar";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { motion, useScroll, useTransform } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50], [0.95, 1]);
  const headerBlur = useTransform(scrollY, [0, 50], [12, 20]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${isScrolled ? "shadow-lg" : ""
        }`}
      role="banner"
      style={{
        opacity: headerOpacity,
        backdropFilter: useTransform(headerBlur, (blur) => `blur(${blur}px)`),
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            className="bg-primary rounded-full p-1"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <code className="text-primary-foreground text-sm font-bold">SP</code>
          </motion.div>
          <motion.span
            className="font-bold text-lg hidden md:inline-block"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ x: 4 }}
          >
            SecurePulse
          </motion.span>
        </Link>

        <nav className="hidden lg:flex items-center gap-4" aria-label="Primary navigation">
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
                <Link to="/pricing" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pricing
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
                            6-month professional roadmap & career guidance
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/courses" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none flex items-center gap-1">
                            📚 <span>Courses</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            In-depth video courses and tutorials
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/learning-paths" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-blue-500/20">
                          <div className="text-sm font-medium leading-none flex items-center gap-1">
                            🎓 <span>Learning Paths</span>
                            <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Structured curriculum: Beginner → Advanced
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/labs" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground bg-gradient-to-r from-red-950/20 to-orange-950/20 border border-red-500/20">
                          <div className="text-sm font-medium leading-none flex items-center gap-1">
                            <Target className="h-4 w-4 text-red-500" />
                            <span>Hands-On Labs</span>
                            <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            SQL injection, XSS, and more challenges
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/certificates" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground bg-gradient-to-r from-yellow-950/20 to-orange-950/20 border border-yellow-500/20">
                          <div className="text-sm font-medium leading-none flex items-center gap-1">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span>Certificates</span>
                            <span className="text-xs bg-yellow-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Earn & verify professional certificates
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/progress" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Progress Tracker</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Skills, achievements & certificates
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/quizzes" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground bg-gradient-to-r from-green-950/20 to-emerald-950/20 border border-green-500/20">
                          <div className="text-sm font-medium leading-none flex items-center gap-1">
                            🎯 <span>Quiz Arena</span>
                            <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Test knowledge & compete on leaderboards
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
                        <Link to="/glossary" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Glossary</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            200+ cybersecurity terms & definitions
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/interview-prep" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Interview Prep</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            50+ interview questions with good vs bad answers
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/blue-team" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground bg-gradient-to-r from-blue-950/20 to-cyan-950/20 border border-blue-500/20">
                          <div className="text-sm font-medium leading-none flex items-center gap-1">
                            <Shield className="h-4 w-4 text-blue-500" />
                            <span>Blue Team / SOC</span>
                            <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Defensive security playbooks & secure coding
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
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm text-muted-foreground"
                    onClick={toggleSearch}
                    aria-label="Open search"
                  >
                    <SearchIcon className="mr-2 h-4 w-4" aria-hidden="true" />
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
              <a
                href="https://github.com/Surya-Chinnathambi/HackWebTools"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View project on GitHub (opens in new tab)"
              >
                <Github className="h-5 w-5" aria-hidden="true" />
              </a>
            </Button>

            {/* Authentication Buttons/Menu */}
            {user ? (
              // Logged in - Show user menu
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden lg:flex gap-2">
                    <UserCircle className="h-5 w-5" />
                    <span className="max-w-[100px] truncate">{user.name || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/progress')}>
                    <Target className="mr-2 h-4 w-4" />
                    My Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/certificates')}>
                    <Award className="mr-2 h-4 w-4" />
                    Certificates
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/pricing')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pricing & Plans
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Not logged in - Show Login/Sign Up buttons
              <div className="hidden lg:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link to="/login?signup=true">Sign Up</Link>
                </Button>
              </div>
            )}

            <ThemeToggle />
          </div>
        </nav>

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
                to="/learning-paths"
                className="text-base font-medium transition-colors hover:text-primary bg-gradient-to-r from-blue-600/10 to-purple-600/10 px-3 py-2 rounded-md border border-blue-500/20"
                onClick={() => setIsMenuOpen(false)}
              >
                🎓 Learning Paths <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full ml-1">NEW</span>
              </Link>
              <Link
                to="/certificates"
                className="text-base font-medium transition-colors hover:text-primary bg-gradient-to-r from-yellow-600/10 to-orange-600/10 px-3 py-2 rounded-md border border-yellow-500/20"
                onClick={() => setIsMenuOpen(false)}
              >
                🏆 Certificates <span className="text-xs bg-yellow-500 text-white px-1.5 py-0.5 rounded-full ml-1">NEW</span>
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

              {/* Mobile Authentication */}
              <div className="pt-4 mt-4 border-t border-border space-y-3">
                {user ? (
                  <>
                    <div className="text-sm text-muted-foreground px-2">
                      Logged in as <span className="font-medium text-foreground">{user.name || user.email}</span>
                    </div>
                    <Link
                      to="/progress"
                      className="text-base font-medium transition-colors hover:text-primary flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Target size={16} /> My Progress
                    </Link>
                    <Link
                      to="/pricing"
                      className="text-base font-medium transition-colors hover:text-primary flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <CreditCard size={16} /> Pricing & Plans
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-base font-medium text-red-600 hover:text-red-700 flex items-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-center text-base font-medium transition-colors hover:text-primary border border-border rounded-md py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log In
                    </Link>
                    <Link
                      to="/login?signup=true"
                      className="block text-center text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md py-2 transition-all hover:shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                    <Link
                      to="/pricing"
                      className="block text-center text-base font-medium transition-colors hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      View Pricing
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default Header;
