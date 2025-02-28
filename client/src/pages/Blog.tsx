import { BlogPostList } from "@/components/BlogPostList";
import { BlogSidebar } from "@/components/BlogSidebar";
import { SearchBar } from "@/components/SearchBar";
import { useLocation } from "wouter";

export default function Blog() {
  const [, search] = useLocation();
  const params = new URLSearchParams(search);
  const tag = params.get("tag") || undefined;
  const searchQuery = params.get("search") || undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-serif">
              {tag ? `Posts tagged "${tag}"` : 
               searchQuery ? `Search: "${searchQuery}"` : 
               "All Posts"}
            </h1>
            <SearchBar />
          </div>
          <BlogPostList tag={tag} search={searchQuery} />
        </div>
        <div className="md:col-span-1">
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
}