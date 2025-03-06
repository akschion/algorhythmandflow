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
        "relative z-10 overflow-hidden rounded-xl shadow-md group",
        preview 
          ? "bg-gradient-to-br from-muted/50 to-background p-6" 
          : "border-2 border-white/10 p-1"
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
              preview ? "text-foreground group-hover:text-primary transition-colors" : "text-foreground"
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
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { type Post } from "@shared/schema";
import { Link } from "react-router-dom";

interface BlogPostProps {
  post: Post;
  featured?: boolean;
}

export function BlogPost({ post, featured = false }: BlogPostProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`group relative overflow-hidden ${featured ? "col-span-2 row-span-2" : ""}`}
    >
      <Link to={`/post/${post.slug}`} className="block h-full">
        <Card className="h-full border-0 shadow-md overflow-hidden bg-gradient-to-br from-background to-muted/10">
          {/* Decorative background patterns */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)] opacity-5" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
          </div>

          <CardContent className="p-5 relative z-10">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString()}
              </div>
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
