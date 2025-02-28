import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { BlogPost } from "@/components/BlogPost";
import { BlogSidebar } from "@/components/BlogSidebar";
import { type Post } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useQuery<Post>({
    queryKey: [`/api/posts/${slug}`]
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-8" />
            <Skeleton className="h-64" />
          </div>
          <div className="md:col-span-1">
            <BlogSidebar />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <BlogPost post={post} />
        </div>
        <div className="md:col-span-1">
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
}
