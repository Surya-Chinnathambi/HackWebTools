import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Shield,
  Code,
  Zap,
  BookOpen,
  Target,
  BarChart3,
  Award,
  Search as SearchIcon,
  LogOut,
  Settings,
  ChevronDown,
  ChevronRight,
  FileText,
  GraduationCap,
  Gamepad2,
  Home,
  Crown,
  Terminal,
  Key,
  Globe,
  TrendingUp,
  Wifi,
  Bug,
  Hash,
  FileCode,
  Braces,
  Activity,
  BookMarked,
  Brain,
  Lock,
  Database,
  Bell,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import { getAllTools } from '@/utils/toolsData';
import { cn } from '@/lib/utils';

interface NavLink {
  label: string;
  href: string;
  icon: any;
  color: string;
  badge?: {
    text: string;
    variant: 'new' | 'live';
  };
  highlight?: boolean;
}

const toolsLinks: NavLink[] = [
  { label: 'All Tools', href: '/tools', icon: Code, color: 'text-blue-500' },
  { label: 'Port Scanner', href: '/port-scanner', icon: Wifi, color: 'text-cyan-500' },
  { label: 'Vuln Scanner', href: '/advanced-vuln-scanner', icon: Bug, color: 'text-red-500' },
  { label: 'XSS Tester', href: '/xss-tester', icon: Braces, color: 'text-yellow-500' },
  { label: 'API Tester', href: '/api-security-tester', icon: Globe, color: 'text-green-500' },
  {
    label: 'Threat Intel',
    href: '/threat-intelligence',
    icon: Activity,
    color: 'text-purple-500',
    badge: { text: 'LIVE', variant: 'live' },
  },
];

const utilitiesLinks: NavLink[] = [
  { label: 'Payloads', href: '/payloads', icon: Target, color: 'text-orange-500' },
  { label: 'Encoder/Decoder', href: '/encoder-decoder', icon: Key, color: 'text-purple-500' },
  { label: 'Hash Cracker', href: '/hash-cracker', icon: Hash, color: 'text-blue-500' },
  { label: 'Reverse Shells', href: '/reverse-shell', icon: Terminal, color: 'text-green-500' },
  { label: 'Wordlist Gen', href: '/wordlist-generator', icon: FileText, color: 'text-indigo-500' },
  { label: 'Command Gen', href: '/command-generator', icon: FileCode, color: 'text-cyan-500' },
  { label: 'Report Gen', href: '/report-generator', icon: FileText, color: 'text-pink-500' },
  { label: 'Exploit DB', href: '/exploit-db', icon: Database, color: 'text-red-500' },
];

const learnLinks: NavLink[] = [
  { label: 'Learning Hub', href: '/learning-hub', icon: BookOpen, color: 'text-blue-500' },
  { label: 'Courses', href: '/courses', icon: GraduationCap, color: 'text-purple-500' },
  { label: 'Learning Paths', href: '/learning-paths', icon: BookMarked, color: 'text-indigo-500' },
  {
    label: 'Hands-On Labs',
    href: '/labs',
    icon: Target,
    color: 'text-red-500',
    badge: { text: 'NEW', variant: 'new' },
    highlight: true,
  },
  { label: 'OWASP Lab', href: '/owasp-lab', icon: Lock, color: 'text-orange-500' },
  { label: 'Quiz Arena', href: '/quizzes', icon: Gamepad2, color: 'text-green-500' },
  { label: 'Interview Prep', href: '/interview-prep', icon: Brain, color: 'text-cyan-500' },
  { label: 'Glossary', href: '/glossary', icon: FileText, color: 'text-yellow-500' },
  { label: 'Blue Team', href: '/blue-team', icon: Shield, color: 'text-blue-600' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
      if (isSearchOpen && searchResults.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedResultIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedResultIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
        }
        if (e.key === 'Enter' && searchResults[selectedResultIndex]) {
          e.preventDefault();
          navigate(`/tools/${searchResults[selectedResultIndex].id}`);
          setIsSearchOpen(false);
          setSearchQuery('');
          setSearchResults([]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, searchResults, selectedResultIndex, navigate]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchOpen]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const allTools = getAllTools();
      const filtered = allTools.filter((tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.tags && tool.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      ).slice(0, 8);
      setSearchResults(filtered);
      setSelectedResultIndex(0);
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDesktopMenu(null);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg'
          : 'bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30'
      )}
    >
      <div className="container mx-auto px-4">
        {/* FIX: Use grid layout for precise 3-column alignment: logo | nav | actions */}
        <div className="grid grid-cols-[auto_1fr_auto] h-16 items-center gap-4">

          {/* Logo — left column, fixed width */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Shield className="h-8 w-8 text-red-500 group-hover:text-red-600 transition-colors" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent whitespace-nowrap">
              HackWebTools
            </span>
          </Link>

          {/* Desktop Navigation — center column, perfectly centered */}
          <nav className="hidden lg:flex items-center justify-center gap-1">

            {/* Home */}
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'gap-1.5 h-9 px-3 text-sm font-medium',
                  isActive('/') && 'bg-accent text-accent-foreground'
                )}
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>

            {/* Tools Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDesktopMenu('tools')}
              onMouseLeave={() => setOpenDesktopMenu(null)}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'gap-1.5 h-9 px-3 text-sm font-medium',
                  openDesktopMenu === 'tools' && 'bg-accent'
                )}
              >
                <Code className="h-4 w-4" />
                Tools
                <ChevronDown className={cn(
                  'h-3 w-3 transition-transform duration-200',
                  openDesktopMenu === 'tools' && 'rotate-180'
                )} />
              </Button>
              <AnimatePresence>
                {openDesktopMenu === 'tools' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full pt-2 z-50"
                  >
                    <div className="w-[560px] rounded-xl border bg-popover p-5 shadow-2xl">
                      <div className="grid grid-cols-2 gap-1.5">
                        {toolsLinks.map((link) => (
                          <Link
                            key={link.href}
                            to={link.href}
                            className={cn(
                              'flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent group',
                              isActive(link.href) && 'bg-accent/50'
                            )}
                          >
                            <link.icon className={cn('h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform', link.color)} />
                            <span className="font-medium text-sm flex-1">{link.label}</span>
                            {link.badge && (
                              <Badge
                                variant={link.badge.variant === 'live' ? 'destructive' : 'default'}
                                className="text-[10px] px-1.5 py-0 h-4"
                              >
                                {link.badge.text}
                              </Badge>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Utilities Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDesktopMenu('utilities')}
              onMouseLeave={() => setOpenDesktopMenu(null)}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'gap-1.5 h-9 px-3 text-sm font-medium',
                  openDesktopMenu === 'utilities' && 'bg-accent'
                )}
              >
                <Zap className="h-4 w-4" />
                Utilities
                <ChevronDown className={cn(
                  'h-3 w-3 transition-transform duration-200',
                  openDesktopMenu === 'utilities' && 'rotate-180'
                )} />
              </Button>
              <AnimatePresence>
                {openDesktopMenu === 'utilities' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full pt-2 z-50"
                  >
                    <div className="w-[560px] rounded-xl border bg-popover p-5 shadow-2xl">
                      <div className="grid grid-cols-2 gap-1.5">
                        {utilitiesLinks.map((link) => (
                          <Link
                            key={link.href}
                            to={link.href}
                            className={cn(
                              'flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent group',
                              isActive(link.href) && 'bg-accent/50'
                            )}
                          >
                            <link.icon className={cn('h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform', link.color)} />
                            <span className="font-medium text-sm">{link.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Learn Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDesktopMenu('learn')}
              onMouseLeave={() => setOpenDesktopMenu(null)}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'gap-1.5 h-9 px-3 text-sm font-medium',
                  openDesktopMenu === 'learn' && 'bg-accent'
                )}
              >
                <BookOpen className="h-4 w-4" />
                Learn
                <ChevronDown className={cn(
                  'h-3 w-3 transition-transform duration-200',
                  openDesktopMenu === 'learn' && 'rotate-180'
                )} />
              </Button>
              <AnimatePresence>
                {openDesktopMenu === 'learn' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full pt-2 z-50"
                  >
                    <div className="w-[560px] rounded-xl border bg-popover p-5 shadow-2xl">
                      <div className="grid grid-cols-2 gap-1.5">
                        {learnLinks.map((link) => (
                          <Link
                            key={link.href}
                            to={link.href}
                            className={cn(
                              'flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent group',
                              isActive(link.href) && 'bg-accent/50',
                              link.highlight && 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20'
                            )}
                          >
                            <link.icon className={cn('h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform', link.color)} />
                            <span className="font-medium text-sm flex-1">{link.label}</span>
                            {link.badge && (
                              <Badge
                                variant={link.badge.variant === 'new' ? 'default' : 'destructive'}
                                className="text-[10px] px-1.5 py-0 h-4"
                              >
                                {link.badge.text}
                              </Badge>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress */}
            <Link to="/progress">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'gap-1.5 h-9 px-3 text-sm font-medium',
                  isActive('/progress') && 'bg-accent text-accent-foreground'
                )}
              >
                <BarChart3 className="h-4 w-4" />
                Progress
              </Button>
            </Link>

            {/* Dashboard CTA */}
            <Link to="/dashboard">
              <Button
                size="sm"
                className="gap-1.5 h-9 px-4 text-sm font-medium bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 border-0"
              >
                <Sparkles className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </nav>

          {/* Right Actions — right column, fixed width, no wrap */}
          <div className="flex items-center gap-1.5 flex-shrink-0">

            {/* Premium Search Bar */}
            <div ref={searchContainerRef} className="relative hidden md:flex items-center">
              {!isSearchOpen ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setTimeout(() => searchInputRef.current?.focus(), 100);
                  }}
                  className="gap-2 h-9 px-3 text-muted-foreground hover:text-foreground border border-transparent hover:border-border hover:bg-accent/80 transition-all"
                >
                  <SearchIcon className="h-4 w-4" />
                  <span className="text-sm hidden xl:inline-block">Search</span>
                  <kbd className="pointer-events-none hidden xl:flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted/50 px-1.5 font-mono text-[10px] font-semibold">
                    <span>⌘K</span>
                  </kbd>
                </Button>
              ) : (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 380, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="relative"
                >
                  {/* Search Input */}
                  <div className="relative bg-background rounded-xl border-2 border-primary/50 shadow-lg shadow-primary/10 transition-all group">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <SearchIcon className="h-4 w-4 text-primary flex-shrink-0" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search tools, resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none min-w-0"
                        autoComplete="off"
                        spellCheck="false"
                      />
                      {isSearching && (
                        <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse flex-shrink-0" />
                      )}
                      {searchQuery && !isSearching && (
                        <button
                          onClick={() => { setSearchQuery(''); setSearchResults([]); searchInputRef.current?.focus(); }}
                          className="h-5 w-5 rounded flex items-center justify-center hover:bg-muted flex-shrink-0"
                        >
                          <X className="h-3 w-3 text-muted-foreground" />
                        </button>
                      )}
                      <div className="h-4 w-px bg-border flex-shrink-0" />
                      <button
                        onClick={() => { setIsSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                        className="text-[11px] text-muted-foreground hover:text-foreground font-semibold flex-shrink-0"
                      >
                        ESC
                      </button>
                    </div>
                  </div>

                  {/* Search Results Dropdown */}
                  <AnimatePresence>
                    {searchQuery && searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        className="absolute top-full mt-2 w-full right-0 bg-background border-2 border-border rounded-xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="px-3 py-2 border-b bg-muted/30 flex items-center justify-between">
                          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <kbd className="px-1 py-0.5 rounded bg-background border font-mono">↑↓</kbd>
                            <kbd className="px-1 py-0.5 rounded bg-background border font-mono">↵</kbd>
                          </div>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {searchResults.map((result, index) => (
                            <button
                              key={result.id}
                              onClick={() => { navigate(`/tools/${result.id}`); setIsSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                              onMouseEnter={() => setSelectedResultIndex(index)}
                              className={cn(
                                'w-full flex items-start gap-3 px-3 py-3 text-left transition-all border-l-2',
                                selectedResultIndex === index
                                  ? 'bg-red-500/5 border-l-red-500'
                                  : 'hover:bg-muted/40 border-l-transparent'
                              )}
                            >
                              <div className={cn(
                                'p-2 rounded-lg flex-shrink-0 transition-colors',
                                selectedResultIndex === index
                                  ? 'bg-gradient-to-br from-red-500 to-orange-500'
                                  : 'bg-muted'
                              )}>
                                <Zap className={cn('h-3.5 w-3.5', selectedResultIndex === index ? 'text-white' : 'text-muted-foreground')} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className={cn('font-semibold text-sm truncate', selectedResultIndex === index && 'text-primary')}>
                                    {result.name}
                                  </h4>
                                  {selectedResultIndex === index && <ArrowRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{result.description}</p>
                                {result.tags?.length > 0 && (
                                  <div className="flex gap-1 mt-1.5">
                                    {result.tags.slice(0, 3).map((tag: string) => (
                                      <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    {searchQuery && !isSearching && searchResults.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-full mt-2 w-full bg-background border-2 border-border rounded-xl shadow-2xl z-50 py-8"
                      >
                        <div className="text-center space-y-2">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                            <SearchIcon className="h-5 w-5 text-muted-foreground/50" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">No results found</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Try different keywords</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => navigate('/search')}
              aria-label="Search"
            >
              <SearchIcon className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications — Only if logged in */}
            {user && (
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center leading-none">
                  3
                </span>
              </Button>
            )}

            {/* User Menu or Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 h-9 px-2">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden xl:inline-block text-sm font-medium max-w-[80px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/progress')}>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/certificates')}>
                    <Award className="mr-2 h-4 w-4" />
                    Certificates
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-4 text-sm border-primary/50 hover:bg-primary/10 hover:border-primary"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      {/* Gradient Accent Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-t overflow-hidden"
          >
            <div className="container mx-auto px-4 py-5 space-y-5 max-h-[calc(100vh-4rem)] overflow-y-auto">

              {/* Security Tools */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
                  Security Tools
                </h3>
                {toolsLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent',
                      isActive(link.href) && 'bg-accent'
                    )}
                  >
                    <link.icon className={cn('h-4 w-4 flex-shrink-0', link.color)} />
                    <span className="flex-1 text-sm font-medium">{link.label}</span>
                    {link.badge && (
                      <Badge variant={link.badge.variant === 'live' ? 'destructive' : 'default'} className="text-[10px] px-1.5 py-0 h-4">
                        {link.badge.text}
                      </Badge>
                    )}
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </div>

              {/* Utilities */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
                  Utilities
                </h3>
                {utilitiesLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent',
                      isActive(link.href) && 'bg-accent'
                    )}
                  >
                    <link.icon className={cn('h-4 w-4 flex-shrink-0', link.color)} />
                    <span className="flex-1 text-sm font-medium">{link.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </div>

              {/* Learning */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
                  Learning & Practice
                </h3>
                {learnLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent',
                      isActive(link.href) && 'bg-accent',
                      link.highlight && 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20'
                    )}
                  >
                    <link.icon className={cn('h-4 w-4 flex-shrink-0', link.color)} />
                    <span className="flex-1 text-sm font-medium">{link.label}</span>
                    {link.badge && (
                      <Badge variant={link.badge.variant === 'new' ? 'default' : 'destructive'} className="text-[10px] px-1.5 py-0 h-4">
                        {link.badge.text}
                      </Badge>
                    )}
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </div>

              {/* Bottom Links */}
              <div className="space-y-1.5 pt-2 border-t">
                <Link
                  to="/progress"
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent',
                    isActive('/progress') && 'bg-accent'
                  )}
                >
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  <span className="flex-1 text-sm font-medium">Progress</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="flex-1 text-sm">Dashboard</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Auth */}
              {!user && (
                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    className="w-full h-10 text-sm border-primary/50 hover:bg-primary/10 hover:border-primary"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}