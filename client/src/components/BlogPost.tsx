import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MathRenderer } from "./MathRenderer";
import { format } from "date-fns";
import type { Post } from "@shared/schema";

interface BlogPostProps {
  post: Post;
  preview?: boolean;
}

export function BlogPost({ post, preview = false }: BlogPostProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">
          {preview ? (
            <a href={`/post/${post.slug}`} className="hover:text-primary">
              {post.title}
            </a>
          ) : (
            post.title
          )}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {format(new Date(post.publishedAt), "MMMM d, yyyy")}
        </div>
        <div className="flex gap-2 mt-2">
          {post.tags.map(tag => (
            <a
              key={tag}
              href={`/blog?tag=${tag}`}
              className="text-xs px-2 py-1 rounded-full bg-accent hover:bg-accent/80"
            >
              {tag}
            </a>
          ))}
        </div>
      </CardHeader>
      <CardContent className="prose dark:prose-invert">
        <MathRenderer content={preview ? post.excerpt : post.content} />
      </CardContent>
    </Card>
  );
}
