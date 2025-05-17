
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const CallToAction = () => {
  return (
    <section className="container px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-lg border bg-card/70 backdrop-blur-sm p-8 shadow-sm"
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-2xl font-bold border-none">Ready to explore the tools?</h2>
          <p className="text-muted-foreground">
            Discover detailed documentation, usage examples, and command references
          </p>
          <Button asChild size="lg" className="group">
            <Link to="/tools">
              Browse All Tools 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CallToAction;
