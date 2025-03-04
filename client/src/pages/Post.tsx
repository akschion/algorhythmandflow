import { useQuery } from "@tanstack/react-query";
import { BlogSidebar } from "@/components/BlogSidebar";
import { type Post } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { getPost } from "@/lib/posts";

interface PostPageProps {
  slug: string;
}

export default function Post({ slug }: PostPageProps) {
  const { data: post, isLoading } = useQuery<Post | undefined>({
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

  if (!post) {
    return <div className="container mx-auto px-4 py-8">Post not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md-col-span-1">
          <BlogSidebar />
        </div>
        <article className="md:col-span-3 prose dark:prose-invert max-w-none">
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>
    </div>
  );
}