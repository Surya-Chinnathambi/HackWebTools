import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, Search, AlertTriangle, Bug, Zap, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface NotFoundProps {
  errorType?: "404" | "500" | "network" | "permission";
  errorMessage?: string;
}

const NotFound = ({ errorType = "404", errorMessage }: NotFoundProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [glitchText, setGlitchText] = useState("404");

  const errorConfig = {
    "404": {
      code: "404",
      title: "Page Not Found",
      description: errorMessage || "The page you're looking for doesn't exist or has been moved.",
      icon: Search,
      color: "text-blue-500"
    },
    "500": {
      code: "500",
      title: "Server Error",
      description: errorMessage || "Something went wrong on our end. Please try again later.",
      icon: Bug,
      color: "text-red-500"
    },
    "network": {
      code: "ERR",
      title: "Network Error",
      description: errorMessage || "Unable to connect to the server. Check your internet connection.",
      icon: Zap,
      color: "text-yellow-500"
    },
    "permission": {
      code: "403",
      title: "Access Denied",
      description: errorMessage || "You don't have permission to access this resource.",
      icon: Shield,
      color: "text-orange-500"
    }
  };

  const config = errorConfig[errorType];
  const Icon = config.icon;

  useEffect(() => {
    console.error(
      `${config.code} Error: User attempted to access:`,
      location.pathname
    );

    // Glitch effect for error code
    const glitchChars = ['4', '0', '4', '@', '#', '%', '5', '0', '0'];
    const interval = setInterval(() => {
      const randomChars = Array(3).fill(0).map(() =>
        glitchChars[Math.floor(Math.random() * glitchChars.length)]
      ).join('');
      setGlitchText(randomChars);

      setTimeout(() => setGlitchText(config.code), 100);
    }, 3000);

    return () => clearInterval(interval);
  }, [location.pathname, config.code]);

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            {/* Animated Icon */}
            <motion.div
              animate={floatingAnimation}
              className="flex justify-center"
            >
              <div className={`relative ${config.color}`}>
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Icon className="h-24 w-24 md:h-32 md:w-32" />
                </motion.div>

                {/* Glowing effect */}
                <motion.div
                  className="absolute inset-0 blur-2xl opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Icon className="h-24 w-24 md:h-32 md:w-32" />
                </motion.div>
              </div>
            </motion.div>

            {/* Error Code with Glitch Effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className={`text-7xl md:text-9xl font-bold ${config.color} font-mono tracking-wider`}>
                {glitchText}
              </h1>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                {config.title}
              </h2>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {config.description}
              </p>
            </motion.div>

            {/* Path Info */}
            {errorType === "404" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-w-md mx-auto"
              >
                <code className="text-sm text-gray-700 dark:text-gray-300 break-all">
                  {location.pathname}
                </code>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                size="lg"
                className="gap-2 w-full sm:w-auto"
              >
                <ArrowLeft className="h-5 w-5" />
                Go Back
              </Button>

              <Button
                onClick={() => navigate("/")}
                size="lg"
                className="gap-2 w-full sm:w-auto"
              >
                <Home className="h-5 w-5" />
                Return Home
              </Button>
            </motion.div>

            {/* Animated Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full ${config.color} opacity-20`}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                  }}
                  animate={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
