import { BlogPost } from "@/components/BlogPost";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import type { Post } from "@shared/schema";

export default function Blog() {
  const [, search] = useLocation();
  const params = new URLSearchParams(search);
  const tag = params.get("tag") || undefined;

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["/api/posts", { tag }]
  });

  const allTags = Array.from(new Set(posts?.flatMap(p => p.tags) || []));
  const recentPosts = posts?.slice(0, 5) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-12">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background">
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </div>

          <div className="relative p-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent pb-2">
              {tag ? `Posts tagged "${tag}"` : "Recent Posts"}
            </h1>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-muted/50 to-background border-none shadow-lg overflow-visible">
          <CardContent className="pt-6">
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

        {!tag && (
          <Card className="bg-gradient-to-br from-background via-background/95 to-muted border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">
                Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <a
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="no-underline"
                  >
                    <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors">
                      {tag}
                    </Badge>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}