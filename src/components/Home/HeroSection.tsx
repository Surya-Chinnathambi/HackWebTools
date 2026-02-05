
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/Search/SearchBar";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, filter: "blur(10px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <section ref={ref} className="w-full py-12 md:py-20 lg:py-24 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-background via-primary/5 to-background z-0"
        style={{ y }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Animated background orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="container px-4 md:px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity, scale }}
      >
        <div className="flex flex-col items-center space-y-6 text-center">
          <motion.div className="space-y-3" variants={itemVariants}>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="gradient-heading inline-block">SecurePulse</span>
              <br />
              <motion.span
                className="inline-block"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Security Documentation
              </motion.span>
            </motion.h1>
            <motion.p
              className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl"
              variants={itemVariants}
            >
              Professional documentation for penetration testing tools and security utilities.
              Find detailed documentation, usage examples, and advanced commands.
            </motion.p>
          </motion.div>

          <motion.div className="w-full max-w-sm" variants={itemVariants}>
            <SearchBar />
          </motion.div>

          <motion.div className="flex flex-wrap justify-center gap-4" variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button asChild className="btn-primary group">
                <Link to="/tools">
                  Browse All Tools
                  <motion.div
                    className="inline-block ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
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
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
