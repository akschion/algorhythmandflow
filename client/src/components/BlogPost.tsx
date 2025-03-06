import { type Post } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlogPostProps {
  post: Post;
  preview?: boolean;
  showContent?: boolean;
  showTitle?: boolean;
}

export function BlogPost({ post, preview = false, showContent = true, showTitle = true }: BlogPostProps) {
  // Generate the path-based link for the post
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
      className={cn(
        "relative z-10 overflow-hidden rounded-xl shadow-md",
        preview && "bg-gradient-to-br from-muted/50 to-background p-6"
      )}
      variants={container}
      initial="hidden"
      animate="show"
      onClick={preview ? () => window.location.href = postLink : undefined}
      style={preview ? { cursor: "pointer" } : {}}
    >
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <time dateTime={post.publishedAt.toString()}>
            {format(new Date(post.publishedAt), "MMM d, yyyy")}
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

        {showTitle && (
          <motion.h2
            variants={item}
            className={cn(
              "text-xl md:text-2xl font-bold mb-3",
              preview ? "text-foreground hover:text-primary transition-colors" : "text-foreground"
            )}
          >
            {post.title}
          </motion.h2>
        )}

        {showContent ? (
          <motion.div
            variants={item}
            className="prose prose-slate dark:prose-invert
                       prose-headings:text-foreground/90
                       prose-p:text-foreground/80
                       prose-p:leading-relaxed
                       prose-p:text-base
                       prose-a:text-primary/90
                       prose-a:no-underline
                       hover:prose-a:underline
                       prose-blockquote:border-l-primary
                       prose-blockquote:border-opacity-50
                       prose-blockquote:text-foreground/80
                       prose-strong:text-foreground
                       prose-code:text-foreground
                       max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        ) : (
          <motion.p
            variants={item}
            className="text-foreground/80 line-clamp-3 mb-4 text-base leading-relaxed tracking-wide"
          >
            {post.excerpt}
          </motion.p>
        )}
      </div>
    </motion.article>
  );
}