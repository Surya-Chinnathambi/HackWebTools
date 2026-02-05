import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Shield, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface NewsItem {
  title: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    name: string;
  };
  description: string;
}

const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    const apiKey = "pub_877526c4ca76752993ece665c15fe30d2dead";
    const response = await fetch(
      `https://newsdata.io/api/1/news?apikey=${apiKey}&q=cybersecurity&language=en&category=technology`
    );

    if (!response.ok) {
      throw new Error(`NewsData.io API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(data.message || "Error fetching news");
    }

    return data.results.slice(0, 3).map((article: any) => ({
      title: article.title || "Untitled Article",
      url: article.link || "#",
      urlToImage: article.image_url,
      publishedAt: article.pubDate || new Date().toISOString(),
      source: {
        name: article.source_id || "Unknown Source"
      },
      description: article.description || "No description available"
    }));
  } catch (error) {
    console.error("Error fetching cybersecurity news:", error);
    toast({
      title: "Could not load news",
      description: "Failed to fetch the latest cybersecurity news",
      variant: "destructive"
    });
    return [];
  }
};

export const NewsSection = () => {
  const { data: newsItems, isLoading: newsLoading, error } = useQuery({
    queryKey: ['securityNews'],
    queryFn: fetchNews,
    staleTime: 1000 * 60 * 15,
    retry: 1
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
    <section className="container px-4 md:px-6 py-8">
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
        <h2 className="text-2xl font-bold tracking-tight flex items-center">
          <motion.div
            animate={{
              rotate: [0, -5, 5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Shield className="mr-2 h-5 w-5 text-primary" />
          </motion.div>
          Latest Cybersecurity News
        </h2>
        <p className="text-muted-foreground">Stay updated with real-time cybersecurity news and alerts</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {newsLoading ? (
          Array(3).fill(0).map((_, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="overflow-hidden h-full">
                <CardHeader className="pb-0">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/3" />
                </CardHeader>
                <CardContent className="pt-4">
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-4/5" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-8 w-32" />
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : error ? (
          <div className="col-span-3 text-center py-8">
            <p className="text-muted-foreground">Could not load cybersecurity news</p>
            <p className="text-sm text-muted-foreground mt-2">Please try refreshing the page</p>
          </div>
        ) : newsItems && newsItems.length > 0 ? (
          newsItems.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden h-full group relative border-2 hover:border-red-600/50 transition-all duration-500 hover:shadow-xl">
                {/* Animated gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {item.urlToImage && (
                  <motion.div
                    className="relative w-full h-40 overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <motion.img
                      src={item.urlToImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1, filter: "blur(10px)" }}
                      animate={{ scale: 1, filter: "blur(0px)" }}
                      transition={{ delay: i * 0.08 + 0.2, duration: 0.8 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Image overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                )}
                <CardHeader className="pb-2 relative z-10">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-red-600 transition-colors duration-300">{item.title}</CardTitle>
                  <CardDescription>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 + 0.3 }}
                    >
                      {item.source.name} • {formatDate(item.publishedAt)}
                    </motion.span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 relative z-10">
                  <motion.p
                    className="text-sm text-muted-foreground line-clamp-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.08 + 0.4 }}
                  >
                    {item.description}
                  </motion.p>
                </CardContent>
                <CardFooter className="relative z-10">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary flex items-center group/link"
                  >
                    <motion.span
                      whileHover={{ x: -2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      Read full article
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
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </motion.div>
                  </a>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-muted-foreground">No cybersecurity news articles available at the moment</p>
            <p className="text-sm text-muted-foreground mt-2">Please check back later</p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default NewsSection;
