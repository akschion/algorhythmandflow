import { BlogPost } from "@/components/BlogPost";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Post } from "@shared/schema";
import { getPosts } from "@/lib/posts";
import { SEO } from "@/components/SEO";

export default function Blog() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getPosts
  });

  const allTags = Array.from(new Set(posts?.flatMap(p => p.tags) || []));

  // Filter posts based on selected tags
  const filteredPosts = posts?.filter(post => 
    selectedTags.length === 0 || 
    selectedTags.every(tag => post.tags.includes(tag))
  ) || [];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <>
      <SEO
        title="Algorhythm + Flow - Blog"
        description="Explore articles about mathematics, music, and technology. Read articles, learn new things"
        type="website"
      />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] overflow-x-hidden">
        <div className="space-y-8">
          {/* Title Card */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background">
            <div className="absolute inset-0 w-full h-full">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>

            <div className="relative p-6 md:p-8">
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent pb-2">
                {selectedTags.length > 0 
                  ? `Posts tagged: ${selectedTags.join(", ")}`
                  : "All Posts"
                }
              </h1>
            </div>
          </div>

          {/* Topics Filter Module */}
          <Card className="bg-gradient-to-br from-muted/50 to-background border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">
                Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="no-underline focus:outline-none rounded-full"
                  >
                    <Badge 
                      variant={selectedTags.includes(tag) ? "default" : "secondary"}
                      className={`
                        transition-colors duration-200
                        ${selectedTags.includes(tag) 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                          : 'hover:bg-primary hover:text-primary-foreground'
                        }
                      `}
                    >
                      {tag}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="space-y-6">
            {filteredPosts.map(post => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="transform-gpu"
              >
                <BlogPost post={post} preview showContent={false} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}