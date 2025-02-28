import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "./BlogPost";
import { type Post } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPostListProps {
  tag?: string;
}

export function BlogPostList({ tag }: BlogPostListProps) {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts", { tag }]
  });

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
    <div className="space-y-8">
      {posts.map(post => (
        <BlogPost key={post.id} post={post} preview />
      ))}
    </div>
  );
}