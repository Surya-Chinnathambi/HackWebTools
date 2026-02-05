
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/Search/SearchBar";
import { motion } from "framer-motion";

export const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <section className="w-full py-3xl md:py-4xl lg:py-4xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background to-primary/5 z-0"></div>
      <motion.div
        className="container px-4 md:px-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex flex-col items-center space-y-xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="space-y-md"
            variants={itemVariants}
          >
            <h1 className="heading-1">
              <span className="gradient-heading">SecurePulse</span>
              <br /> Security Documentation
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground body-large md:text-xl">
              Professional documentation for penetration testing tools and security utilities.
              Find detailed documentation, usage examples, and advanced commands.
            </p>
          </motion.div>
          <motion.div
            className="w-full max-w-sm space-y-md"
            variants={itemVariants}
          >
            <SearchBar />
          </motion.div>
          <motion.div
            className="flex flex-wrap justify-center gap-lg"
            variants={itemVariants}
          >
            <Button asChild>
              <Link to="/tools">
                Browse All Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://github.com/Surya-Chinnathambi/HackWebTools"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
