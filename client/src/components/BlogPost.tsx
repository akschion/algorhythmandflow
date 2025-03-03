import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { /* useQuery */ } from "@tanstack/react-query"; // Remove useQuery import
import { motion } from "framer-motion";
import { useState, useEffect } from "react"; // Import useState and useEffect
import type { Post } from "@shared/schema";

export default function Blog() {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [posts, setPosts] = useState<Post[] | undefined>(undefined); // Use useState for posts

    // const { data: posts } = useQuery<Post[]>({ // Comment out useQuery
    //     queryKey: ["/api/posts"]
    // });

    useEffect(() => {
        fetch('/data/posts.json') // Fetch from static posts.json
            .then(res => res.json())
            .then(data => setPosts(data as Post[])) // Cast data to Post[]
            .catch(error => console.error("Error fetching post list:", error));
    }, []);


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
                            className="transform-gpu" // Enable hardware acceleration
                        >
                            <BlogPost post={post} preview className="text-foreground/80" showContent={false} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
