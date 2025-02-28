import { BlogPost } from "@/components/BlogPost";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar with Topics */}
        <div className="md:col-span-1">
          <Card className="bg-gradient-to-br from-background via-background/95 to-muted border-none shadow-lg sticky top-24">
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
                    className="no-underline"
                  >
                    <Badge 
                      variant={selectedTags.includes(tag) ? "default" : "secondary"}
                      className={`hover:bg-primary hover:text-primary-foreground transition-colors ${
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

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background mb-8">
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

          <div className="space-y-6">
            {filteredPosts.map(post => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BlogPost post={post} preview />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}