import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogSidebar } from "@/components/BlogSidebar";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@/components/BlogPost";
import type { Post } from "@shared/schema";

export default function Home() {
  const { data: posts } = useQuery<Post[]>({
    queryKey: ["/api/posts"]
  });

  const recentPosts = posts?.slice(0, 5) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <BlogSidebar />
        </div>
        <div className="md:col-span-3 space-y-12">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background">
            <div className="absolute inset-0 w-full h-full">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative p-8 md:p-12"
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent pb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Mathematics × Technology × Hip-Hop
              </motion.h1>
              <motion.p 
                className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Exploring the fascinating intersections of mathematical concepts, technological innovations, and hip-hop culture through academic research and analysis.
              </motion.p>
            </motion.div>
          </div>

          <Card className="bg-gradient-to-br from-muted/50 to-background border-none shadow-lg overflow-visible">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">
                Recent Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Carousel className="w-full">
                <CarouselContent>
                  {recentPosts.map(post => (
                    <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <BlogPost post={post} preview />
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}