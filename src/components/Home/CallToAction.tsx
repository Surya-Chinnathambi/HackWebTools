
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const CallToAction = () => {
  return (
    <section className="container px-lg md:px-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="card-interactive p-2xl"
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex flex-col items-center justify-center space-y-lg text-center">
          <h2 className="heading-2">Ready to explore the tools?</h2>
          <p className="body-large text-muted-foreground">
            Discover detailed documentation, usage examples, and command references
          </p>
          <Button asChild size="lg" className="btn-primary group">
            <Link to="/tools">
              Browse All Tools
              <ArrowRight className="ml-sm h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CallToAction;
