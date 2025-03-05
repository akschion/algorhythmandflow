import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { BlogPost } from "@/components/BlogPost";
import { BlogSidebar } from "@/components/BlogSidebar";
import { type Post } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { getPost } from "@/lib/posts";
import { SEO } from "@/components/SEO";

export default function Post() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery<Post | undefined>({
    queryKey: ["post", slug],
    queryFn: () => getPost(slug)
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <BlogSidebar />
          </div>
          <div className="md:col-span-3">
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

  return (
    <>
      <SEO
        title={`${post.title} - Algorhythm and Flow`}
        description={post.excerpt}
        type="article"
        article={{
          publishedTime: post.publishedAt.toISOString(),
          tags: post.tags
        }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <BlogSidebar />
          </div>
          <div className="md:col-span-3">
            <BlogPost post={post} showContent={true} showTitle={false} />
          </div>
        </div>
      </div>
    </>
  );
}