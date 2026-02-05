
import { Book, Code, Search, Shield, Terminal, Key, Star, Zap, AlertTriangle, FileText, Database, List, Network, Lock, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <Key className="h-10 w-10 text-primary" />,
    title: "Encoder/Decoder Hub",
    description: "Comprehensive encoding, decoding, and hashing utilities including Base64, URL, Hex, and JWT.",
    link: "/encoder-decoder",
    phase: 1
  },
  {
    icon: <Terminal className="h-10 w-10 text-primary" />,
    title: "Reverse Shell Generator",
    description: "Generate reverse shell payloads for multiple languages and platforms instantly.",
    link: "/reverse-shell",
    phase: 1
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: "Command Generator",
    description: "Build commands for Nmap, SQLMap, Gobuster, and Hydra with easy-to-use interfaces.",
    link: "/command-generator",
    phase: 1
  },
  {
    icon: <Star className="h-10 w-10 text-primary" />,
    title: "Favorites & History",
    description: "Track your recently used payloads and save favorites for quick access.",
    link: "/payload-history",
    phase: 1
  },
  {
    icon: <AlertTriangle className="h-10 w-10 text-primary" />,
    title: "Interactive XSS Tester",
    description: "Test XSS payloads in different contexts with real-time feedback and payload library.",
    link: "/xss-tester",
    phase: 2
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "Report Generator",
    description: "Create professional pentest reports with CVSS v3.1 calculator and export to HTML/Markdown.",
    link: "/report-generator",
    phase: 2
  },
  {
    icon: <Database className="h-10 w-10 text-primary" />,
    title: "Exploit Database",
    description: "Browse and search security exploits, CVEs, and proof-of-concept code.",
    link: "/exploit-db",
    phase: 2
  },
  {
    icon: <List className="h-10 w-10 text-primary" />,
    title: "Wordlist Generator",
    description: "Generate custom wordlists with mutations, OSINT data, and combination strategies.",
    link: "/wordlist-generator",
    phase: 2
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "API Security Tester",
    description: "Comprehensive REST API vulnerability scanner with 12+ security tests.",
    link: "/api-security-tester",
    phase: 3
  },
  {
    icon: <Network className="h-10 w-10 text-primary" />,
    title: "Network Port Scanner",
    description: "Discover open ports and identify services with TCP/UDP scanning capabilities.",
    link: "/port-scanner",
    phase: 3
  },
  {
    icon: <Lock className="h-10 w-10 text-primary" />,
    title: "Hash Cracker",
    description: "Crack password hashes using dictionary, brute-force, and rainbow table attacks.",
    link: "/hash-cracker",
    phase: 3
  },
  {
    icon: <GraduationCap className="h-10 w-10 text-primary" />,
    title: "OWASP Top 10 Lab",
    description: "Interactive learning environment for web application security vulnerabilities.",
    link: "/owasp-lab",
    phase: 3
  },
  {
    icon: <Book className="h-10 w-10 text-primary" />,
    title: "Comprehensive Documentation",
    description: "Detailed guides and documentation for the most popular penetration testing tools.",
    link: "/tools",
    phase: 1
  },
  {
    icon: <Code className="h-10 w-10 text-primary" />,
    title: "Payload Library",
    description: "Extensive collection of XSS, SQL injection, fuzzing, and API testing payloads.",
    link: "/payloads",
    phase: 1
  },
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: "Search Functionality",
    description: "Find the tools and payloads you need quickly with powerful search features.",
    link: "/tools",
    phase: 1
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Security Focused",
    description: "Learn ethical hacking techniques and security testing methodologies safely.",
    link: "/tools",
    phase: 1
  }
];

export const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95, filter: "blur(10px)" },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.8
      }
    }
  };

  return (
    <section className="container px-4 md:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Phase 1, 2 & 3 Complete! 🎉</h2>
        <p className="text-muted-foreground">
          Professional-grade penetration testing toolkit with 16 advanced features
        </p>
      </div>
      <motion.div
        className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {features.map((feature, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              y: -8,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
              }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to={feature.link}>
              <Card
                className="backdrop-blur-sm bg-card/60 h-full cursor-pointer relative overflow-hidden group border-2 hover:border-red-600/50 transition-all duration-500 hover:shadow-xl"
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {(feature.phase === 2 || feature.phase === 3) && (
                  <motion.div
                    className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded ${feature.phase === 3 ? 'bg-red-600 text-white' : 'bg-primary text-primary-foreground'
                      }`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.05 + 0.5, type: "spring", stiffness: 500, damping: 20 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {feature.phase === 3 ? 'PHASE 3' : 'NEW'}
                  </motion.div>
                )}
                <CardHeader className="relative z-10">
                  <motion.div
                    className="mb-2"
                    whileHover={{
                      scale: 1.15,
                      rotate: [0, -5, 5, 0],
                      transition: {
                        rotate: {
                          duration: 0.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <CardTitle className="text-lg group-hover:text-red-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
