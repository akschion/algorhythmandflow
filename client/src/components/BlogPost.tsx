import { type Post } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { lazy, Suspense } from "react";

interface BlogPostProps {
  post: Post;
  preview?: boolean;
  showContent?: boolean;
  showTitle?: boolean;
}

// Lazy load the content to improve initial page load
const BlogContent = lazy(() => 
  import('./BlogContent').then(module => ({ 
    default: ({ content }: { content: string }) => (
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
                  max-w-none
                  [&_*]:pointer-events-auto"
        onClick={e => e.stopPropagation()}
        dangerouslySetInnerHTML={{ __html: content || '' }}
      />
    )
  }))
);

export function BlogPost({ post, preview = false, showContent = true, showTitle = true }: BlogPostProps) {
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

  const handlePostClick = (e: React.MouseEvent) => {
    if (preview && !e.defaultPrevented && window.getSelection()?.toString() === '') {
      window.location.href = postLink;
    }
  };

  // Prefetch next post content on hover
  const handleMouseEnter = () => {
    if (preview) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/blog-content/${post.slug}.html`;
      document.head.appendChild(link);
    }
  };

  return (
    <motion.article
      className={cn(
        "relative z-10 overflow-hidden rounded-xl shadow-md group",
        preview 
          ? "bg-gradient-to-br from-muted/40 to-background p-6" 
          : "border-2 border-white/10 p-1"
      )}
      variants={container}
      initial="hidden"
      animate="show"
      onClick={handlePostClick}
      onMouseEnter={handleMouseEnter}
      style={preview ? { cursor: "pointer" } : undefined}
    >
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
      <div className="p-6 md:p-8 lg:p-10">
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
              preview ? "text-foreground group-hover:text-primary transition-colors" : "text-foreground"
            )}
          >
            {post.title}
          </motion.h2>
        )}

        {showContent ? (
          <Suspense fallback={
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          }>
            <BlogContent content={post.content || ''} />
          </Suspense>
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