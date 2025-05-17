
import { PayloadCategory } from "@/types/payload";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface PayloadCategoryCardProps {
  category: PayloadCategory;
  index: number;
}

const PayloadCategoryCard = ({ category, index }: PayloadCategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full hover:shadow-md transition-all duration-300 flex flex-col">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{category.name}</span>
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
              {category.count}
            </span>
          </CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">
            This category contains {category.count} different payloads that can be used for security testing and penetration testing.
          </p>
        </CardContent>
        <CardFooter>
          <Link 
            to={`/payloads?category=${category.id}`} 
            className="text-sm text-primary flex items-center group hover:underline"
          >
            View payloads 
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PayloadCategoryCard;
