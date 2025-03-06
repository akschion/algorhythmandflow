import { useQuery } from "@tanstack/react-query";
import { type Post } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { getPosts } from "@/lib/posts";

export function BlogSidebar() {
  const { data: posts } = useQuery<Post[]>({ 
    queryKey: ["posts"],
    queryFn: getPosts
  });

  const recentPosts = posts?.slice(0, 3) || [];

  return (
    <div className="space-y-8 sticky top-24 w-full md:w-64 flex-shrink-0">
      <Card className="bg-gradient-to-br from-muted/50 to-background border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map(post => (
              <div key={post.id} className="group">
                <a 
                  href={`/post/${post.slug}`}
                  className="text-sm font-medium group-hover:text-primary transition-colors no-underline"
                >
                  {post.title}
                </a>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(post.publishedAt), "MMM d, yyyy")}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}