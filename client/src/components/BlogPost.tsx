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
import { type Post } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { motion } from "framer-motion";

type BlogPostProps = {
  post: Post;
  isPreview?: boolean;
  showContent?: boolean;
};

export function BlogPost({ post, isPreview = false, showContent = true }: BlogPostProps) {
  const postLink = `/post/${post.slug}`;
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.article 
      variants={container}
      initial="hidden"
      animate="show"
      className={`overflow-hidden rounded-lg border border-border bg-card shadow-sm ${isPreview ? 'h-full' : ''}`}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <time dateTime={post.publishedAt}>
            {format(new Date(post.publishedAt), "MMMM d, yyyy")}
          </time>
          <span>•</span>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <a href={postLink} className="no-underline">
          <motion.h2 
            variants={item}
            className="text-xl md:text-2xl font-bold text-foreground mb-3 hover:text-primary transition-colors"
          >
            {post.title}
          </motion.h2>
        </a>

        {showContent && (
          <div className="prose prose-slate dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-primary prose-blockquote:border-opacity-50 prose-blockquote:text-foreground/80 prose-strong:text-foreground prose-code:text-foreground max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        )}
      </div>
    </motion.article>
  );
}
