import { type Post } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface BlogPostProps {
  post: Post;
  preview?: boolean; // Likely not needed for excerpt/full content logic, consider removing if not used elsewhere
  isPreview?: boolean; // Likely not needed for excerpt/full content logic, consider removing if not used elsewhere
  showContent?: boolean; // Prop to control showing full content or excerpt
  showTitle?: boolean; // Prop to control showing the title
}

export function BlogPost({ post, preview = false, isPreview = false, showContent = true, showTitle = true}: BlogPostProps) {
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
            {format(new Date(post.publishedAt), "MMMM d, yyyy")} {/* Corrected date format */}
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

        {showTitle && ( // Conditionally render title based on showTitle
          (preview || isPreview) ? (
            <a href={postLink} className="no-underline">
              <motion.h2
                variants={item}
                className="text-xl md:text-2xl font-bold text-foreground mb-3 hover:text-primary transition-colors"
              >
                {post.title}
              </motion.h2>
            </a>
          ) : (
            <motion.h2
              variants={item}
              className="text-xl md:text-2xl font-bold text-foreground mb-3"
            >
              {post.title}
            </motion.h2>
          )
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
          >
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </motion.div>
        ) : (
          <motion.p
            variants={item}
            className="text-foreground/80 line-clamp-3 mb-4 text-base leading-relaxed tracking-wide"
          >
            {post.excerpt} {/* Display post.excerpt when showContent is false */}
          </motion.p>
        )}
      </div>
    </motion.article>
  );
}