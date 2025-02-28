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
    <Card className="overflow-hidden bg-gradient-to-br from-background via-background/95 to-muted border-none shadow-lg w-full">
      <CardHeader className="space-y-4">
        <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">
          {preview ? (
            <a href={`/post/${post.slug}`} className="hover:opacity-80 transition-opacity">
              {post.title}
            </a>
          ) : (
            post.title
          )}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {format(new Date(post.publishedAt), "MMMM d, yyyy")}
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <a
              key={tag}
              href={`/blog?tag=${tag}`}
              className="text-xs px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary-foreground transition-colors"
            >
              {tag}
            </a>
          ))}
        </div>
      </CardHeader>
      {!preview && (
        <CardContent className="prose prose-lg dark:prose-invert max-w-none">
          <MathRenderer content={post.content} />
        </CardContent>
      )}
    </Card>
  );
}