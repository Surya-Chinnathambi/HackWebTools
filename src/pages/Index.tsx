
import { motion } from "framer-motion";
import HeroSection from "@/components/Home/HeroSection";
import NewsSection from "@/components/Home/NewsSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import CategorySection from "@/components/Home/CategorySection";
import CallToAction from "@/components/Home/CallToAction";
import VAPTEducation from "@/components/VAPTEducation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-16 relative">
      <HeroSection />
      <NewsSection />
      <FeaturesSection />

      {/* VAPT Education Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="container mx-auto px-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-3 flex items-center justify-center gap-3">
            <GraduationCap className="h-8 w-8 text-red-600" />
            Security Fundamentals
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Master the core concepts of cybersecurity with interactive visualizations of VAPT methodology, CIA Triad, and OWASP Top 10
          </p>
        </div>
        <VAPTEducation />
      </motion.section>

      <CategorySection />
      <CallToAction />
    </div>
  );
};

export default Index;
