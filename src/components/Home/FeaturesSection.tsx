
import { Book, Code, Search, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Book className="h-10 w-10 text-primary" />,
    title: "Comprehensive Documentation",
    description: "Detailed guides and documentation for the most popular penetration testing tools."
  },
  {
    icon: <Code className="h-10 w-10 text-primary" />,
    title: "Command Examples",
    description: "Ready-to-use command examples with syntax highlighting and explanations."
  },
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: "Search Functionality",
    description: "Find the tools you need quickly with our powerful search feature."
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Security Focused",
    description: "Learn ethical hacking techniques and security testing methodologies."
  }
];

export const FeaturesSection = () => {
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
    <section className="container px-4 md:px-6">
      <motion.div 
        className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((feature, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card 
              className="backdrop-blur-sm bg-card/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <CardHeader>
                <motion.div 
                  className="mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {feature.icon}
                </motion.div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
