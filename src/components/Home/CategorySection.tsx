
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toolsCategories } from "@/utils/toolsData";

export const CategorySection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
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
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.8
      }
    }
  };

  return (
    <section className="container px-4 md:px-6">
      <motion.div
        className="mb-10"
        initial={{ y: 30, opacity: 0, filter: "blur(10px)" }}
        whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        <motion.h2
          className="text-2xl font-bold tracking-tight border-none"
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Tool Categories
        </motion.h2>
        <p className="text-muted-foreground">Browse tools by their specialized categories</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {toolsCategories.map((category, idx) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
              }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="overflow-hidden h-full group relative border-2 hover:border-red-600/50 transition-all duration-500 hover:shadow-xl"
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              {/* Tool count badge */}
              <motion.div
                className="absolute top-4 right-4 bg-red-600/10 text-red-600 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm z-10"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: idx * 0.08 + 0.4, type: "spring", stiffness: 500, damping: 20 }}
                whileHover={{ scale: 1.1 }}
              >
                {category.tools.length}
              </motion.div>

              <CardHeader className="relative z-10">
                <CardTitle className="group-hover:text-red-600 transition-colors duration-300">{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2">
                  {category.tools.slice(0, 3).map((tool, i) => (
                    <motion.li
                      key={tool.id}
                      className="text-sm flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 + i * 0.05 + 0.5 }}
                    >
                      <motion.span
                        className="mr-2 text-red-600"
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          delay: idx * 0.08 + i * 0.1,
                          duration: 0.5,
                          ease: "easeOut"
                        }}
                      >
                        •
                      </motion.span>
                      {tool.name}
                    </motion.li>
                  ))}
                  {category.tools.length > 3 && (
                    <motion.li
                      className="text-sm text-muted-foreground font-medium"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 + 0.65 }}
                    >
                      + {category.tools.length - 3} more
                    </motion.li>
                  )}
                </ul>
              </CardContent>
              <CardFooter className="relative z-10">
                <Link
                  to={`/tools?category=${category.id}`}
                  className="text-sm font-medium text-primary flex items-center group/link"
                >
                  <motion.span
                    whileHover={{ x: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    View Category
                  </motion.span>
                  <motion.div
                    animate={{
                      x: [0, 3, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </motion.div>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CategorySection;
