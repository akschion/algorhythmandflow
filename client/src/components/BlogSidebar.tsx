import { useQuery } from "@tanstack/react-query";
import { type Post } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BlogSidebar() {
  const { data: posts } = useQuery<Post[]>({ 
    queryKey: ["/api/posts"] 
  });

  const allTags = Array.from(new Set(posts?.flatMap(p => p.tags) || []));

  return (
    <div className="space-y-8 sticky top-24">

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