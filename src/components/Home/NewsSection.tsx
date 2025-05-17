
import { useState, useEffect } from "react";
import { Shield, ChevronRight, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
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
    // Use the provided API key
    const apiKey = "ffa6fcb926d54294a8a8f3d8fda4afb80";
    
    // Fetch cybersecurity-related news
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=cybersecurity+OR+hacking+OR+"data+breach"+OR+"cyber+attack"&sortBy=publishedAt&language=en&pageSize=6&apiKey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === "error") {
      throw new Error(data.message || "Error fetching news");
    }
    
    return data.articles.slice(0, 3).map((article: any) => ({
      title: article.title || "Untitled Article",
      url: article.url || "#",
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: {
        name: article.source?.name || "Unknown Source"
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
    staleTime: 1000 * 60 * 15, // 15 minutes
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

  // Animation variants
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
    <section className="container px-4 md:px-6 py-8">
      <motion.div 
        className="mb-10"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold tracking-tight flex items-center">
          <Shield className="mr-2 h-5 w-5 text-primary" />
          Latest Cybersecurity News
        </h2>
        <p className="text-muted-foreground">Stay updated with real-time cybersecurity news and alerts</p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
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
            <motion.div key={i} variants={itemVariants}>
              <Card className="overflow-hidden h-full transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                {item.urlToImage && (
                  <div className="relative w-full h-40 overflow-hidden">
                    <img 
                      src={item.urlToImage} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  <CardDescription>
                    {item.source.name} • {formatDate(item.publishedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
                </CardContent>
                <CardFooter>
                  <a 
                    href={item.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary flex items-center group"
                  >
                    Read full article 
                    <ExternalLink className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
