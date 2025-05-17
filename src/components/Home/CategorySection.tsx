
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
        className="mb-10"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold tracking-tight border-none">Tool Categories</h2>
        <p className="text-muted-foreground">Browse tools by their specialized categories</p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {toolsCategories.map((category, idx) => (
          <motion.div 
            key={category.id} 
            variants={itemVariants}
          >
            <Card 
              className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {category.tools.length} tools available
                </p>
                <ul className="mt-2 space-y-1">
                  {category.tools.slice(0, 3).map((tool) => (
                    <li key={tool.id} className="text-sm">
                      • {tool.name}
                    </li>
                  ))}
                  {category.tools.length > 3 && (
                    <li className="text-sm text-muted-foreground">
                      + {category.tools.length - 3} more
                    </li>
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                <Link 
                  to={`/tools?category=${category.id}`}
                  className="text-sm font-medium text-primary flex items-center group"
                >
                  View Category 
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
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
