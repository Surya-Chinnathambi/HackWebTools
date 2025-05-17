
import { motion } from "framer-motion";
import HeroSection from "@/components/Home/HeroSection";
import NewsSection from "@/components/Home/NewsSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import CategorySection from "@/components/Home/CategorySection";
import CallToAction from "@/components/Home/CallToAction";

const Index = () => {
  return (
    <div className="flex flex-col gap-16 pb-16 relative">
      <HeroSection />
      <NewsSection />
      <FeaturesSection />
      <CategorySection />
      <CallToAction />
    </div>
  );
};

export default Index;
