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
import { useState } from "react";
import type { Post } from "@shared/schema";

export default function Blog() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["/api/posts"]
  });

  const allTags = Array.from(new Set(posts?.flatMap(p => p.tags) || []));

  // Filter posts based on selected tags
  const filteredPosts = posts?.filter(post => 
    selectedTags.length === 0 || // Show all posts if no tags selected
    selectedTags.every(tag => post.tags.includes(tag)) // Show posts that have ALL selected tags
  ) || [];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag) // Remove tag if already selected
        : [...prev, tag] // Add tag if not selected
    );
  };

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
              {selectedTags.length > 0 
                ? `Posts tagged: ${selectedTags.join(", ")}`
                : "All Posts"
              }
            </h1>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-muted/50 to-background border-none shadow-lg overflow-visible">
          <CardContent className="pt-6">
            <Carousel className="w-full">
              <CarouselContent>
                {filteredPosts.map(post => (
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

        <Card className="bg-gradient-to-br from-background via-background/95 to-muted border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">
              Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="no-underline"
                >
                  <Badge 
                    variant={selectedTags.includes(tag) ? "default" : "secondary"}
                    className={`hover:bg-secondary/80 transition-colors ${
                      selectedTags.includes(tag) 
                        ? 'bg-primary text-primary-foreground' 
                        : ''
                    }`}
                  >
                    {tag}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}