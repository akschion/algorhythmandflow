import { useQuery } from "@tanstack/react-query";
import { type Post } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function BlogSidebar() {
  const { data: posts } = useQuery<Post[]>({ 
    queryKey: ["/api/posts"] 
  });

  const recentPosts = posts?.slice(0, 5) || [];
  const allTags = Array.from(new Set(posts?.flatMap(p => p.tags) || []));

  return (
    <div className="space-y-8 sticky top-24">
      <Card className="bg-gradient-to-br from-background to-muted">
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-foreground opacity-10 rounded-full" />
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf"
              alt="Author"
              className="rounded-full w-full h-full object-cover relative z-10"
            />
          </div>
          <p className="text-sm leading-relaxed">
            A passionate researcher exploring the intersections of mathematics, technology, and hip-hop culture.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {recentPosts.map(post => (
              <li key={post.id}>
                <a 
                  href={`/post/${post.slug}`}
                  className="text-sm hover:text-primary block transition-colors"
                >
                  {post.title}
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(post.publishedAt), "MMM d, yyyy")}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <a
                key={tag}
                href={`/blog?tag=${tag}`}
                className="no-underline"
              >
                <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors">
                  {tag}
                </Badge>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}