import { /* useQuery,  */ } from "@tanstack/react-query"; // Remove useQuery import
import { BlogPost } from "./BlogPost";
import { type Post } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useEffect, useState } from "react"; // Import useState and useEffect

interface BlogPostListProps {
    tag?: string;
}

export function BlogPostList({ tag }: BlogPostListProps) {
    // const { data: posts, isLoading } = useQuery<Post[]>({ // Comment out useQuery
    //     queryKey: ["/api/posts", { tag }]
    // });
    const [posts, setPosts] = useState<Post[] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        fetch('/data/posts.json') // Fetch from static posts.json
            .then(res => res.json())
            .then(data => {
                let filteredPosts = data as Post[]; // Cast data to Post[]
                if (tag) {
                    filteredPosts = filteredPosts.filter(post => post.tags.includes(tag));
                }
                setPosts(filteredPosts);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching post list:", error);
                setIsLoading(false);
            });
    }, [tag]);


    if (isLoading) {
        return Array(3).fill(0).map((_, i) => (
            <div key={i} className="mb-8 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-32" />
            </div>
        ));
    }

    if (!posts?.length) {
        return <div className="text-center py-8">No posts found</div>;
    }

    return (
        <div className="flex flex-col space-y-6">
            {posts.map(post => (
                <motion.div
                    key={post.id}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <BlogPost key={post.id} post={post} preview />
                </motion.div>
            ))}
        </div>
    );
}