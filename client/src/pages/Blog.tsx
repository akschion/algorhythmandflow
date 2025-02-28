import { BlogPostList } from "@/components/BlogPostList";
import { BlogSidebar } from "@/components/BlogSidebar";
import { useLocation } from "wouter";

export default function Blog() {
  const [, search] = useLocation();
  const params = new URLSearchParams(search);
  const tag = params.get("tag") || undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <BlogSidebar />
        </div>
        <div className="md:col-span-3">
          <h1 className="text-3xl font-serif mb-8">
            {tag ? `Posts tagged "${tag}"` : "All Posts"}
          </h1>
          <BlogPostList tag={tag} />
        </div>
      </div>
    </div>
  );
}