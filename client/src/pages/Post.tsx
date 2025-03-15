import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { BlogPost } from "@/components/BlogPost";
import { BlogSidebar } from "@/components/BlogSidebar";
import { type Post } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { getPost } from "@/lib/posts";

export default function Post() {
  const { slug } = useParams<{ slug: string }>();

  // Add .html extension for direct loading
  document.title = `Post - Algorhythm and Flow`;

  const { data: post, isLoading, error } = useQuery<Post | undefined>({
    queryKey: ["post", slug],
    queryFn: () => getPost(slug)
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="w-full xl:w-64 order-2 xl:order-1">
            <BlogSidebar />
          </div>
          <div className="flex-1 order-1 xl:order-2">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-8" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading post:', error);
    return <div>Error loading post</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  // Update document title with post title (abbreviate if too long)
  const MAX_TITLE_LENGTH = 25; // Maximum length for the title in the browser tab
  const displayTitle = post.title.length > MAX_TITLE_LENGTH 
    ? `${post.title.substring(0, MAX_TITLE_LENGTH - 3)}...` 
    : post.title;
  document.title = `${displayTitle} - Algorhythm + Flow`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="w-full xl:w-64 order-2 xl:order-1">
          <BlogSidebar />
        </div>
        <div className="flex-1 order-1 xl:order-2 min-w-0">
          <BlogPost post={post} showContent={true} showTitle={false} />
        </div>
      </div>
    </div>
  );
}