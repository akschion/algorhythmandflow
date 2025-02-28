import { useQuery } from "@tanstack/react-query";
import { type Post } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export function BlogSidebar() {
  const { data: posts } = useQuery<Post[]>({ 
    queryKey: ["/api/posts"] 
  });

  const recentPosts = posts?.slice(0, 5) || [];
  const allTags = [...new Set(posts?.flatMap(p => p.tags) || [])];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf"
            alt="Author"
            className="rounded-full w-32 h-32 mx-auto"
          />
          <p className="text-sm">
            A passionate researcher exploring the intersections of mathematics, technology, and hip-hop culture.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recentPosts.map(post => (
              <li key={post.id}>
                <a 
                  href={`/post/${post.slug}`}
                  className="text-sm hover:text-primary block"
                >
                  {post.title}
                  <div className="text-xs text-muted-foreground">
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
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <a
                key={tag}
                href={`/blog?tag=${tag}`}
                className="text-sm px-3 py-1 rounded-full bg-accent hover:bg-accent/80"
              >
                {tag}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
