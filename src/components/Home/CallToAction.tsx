
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const CallToAction = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <section ref={containerRef} className="container px-lg md:px-xl relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y }}
      >
        <motion.div
          className="absolute top-0 left-1/4 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"
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
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1]
        }}
        className="card-interactive p-2xl relative group"
        style={{ opacity, scale }}
        whileHover={{
          y: -10,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 25
          }
        }}
      >
        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(45deg, rgba(220, 38, 38, 0.3), rgba(234, 88, 12, 0.3), rgba(220, 38, 38, 0.3))",
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-6 text-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 20
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="h-12 w-12 text-red-600" />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Ready to explore the tools?
          </motion.h2>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Discover detailed documentation, usage examples, and command references
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.6,
              type: "spring",
              stiffness: 400,
              damping: 20
            }}
          >
            <Button
              asChild
              size="lg"
              className="btn-primary group relative overflow-hidden"
            >
              <Link to="/tools">
                <motion.span
                  className="relative z-10 flex items-center"
                  whileHover={{ x: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  Browse All Tools
                  <motion.div
                    animate={{
                      x: [0, 4, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight className="ml-sm h-4 w-4" />
                  </motion.div>
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CallToAction;
