// client/src/components/BlogPost.tsx
import React, { useEffect, useState } from 'react'; // Import useState and useEffect
import MarkdownRenderer from './MarkdownRenderer'; // Import MarkdownRenderer
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { motion } from "framer-motion";
import type { Post as PostType } from "@shared/schema"; // Rename import to avoid conflict

interface BlogPostProps {
    post: PostType & { content?: string }; // content is now optional and can be string
    preview?: boolean;
    isPreview?: boolean;
    showContent?: boolean;
    showTitle?: boolean;
}

export function BlogPost({ post, preview = false, isPreview = false, showContent = true, showTitle = true }: BlogPostProps) {
    const postLink = `/blog/${post.slug}.html`; // Keep link as is for now - consider changing routing later

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

    // State to hold markdown content - load it dynamically
    const [markdownContent, setMarkdownContent] = useState<string>("");

    useEffect(() => {
        if (showContent && post.slug) { // Load content only when showContent is true and slug exists
            import(`../assets/posts/${post.slug}.md?raw`) // Adjust path if needed
                .then(module => {
                    setMarkdownContent(module.default); // module.default is the raw markdown content
                })
                .catch(error => {
                    console.error("Error loading markdown file:", error);
                    setMarkdownContent("# Error loading post content"); // Fallback in case of error
                });
        }
    }, [showContent, post.slug]); // React to changes in showContent and post.slug

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

                {showTitle && (
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

                {showContent && (
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
                        {/* Use MarkdownRenderer to render markdownContent */}
                        <MarkdownRenderer markdownContent={markdownContent} />
                    </motion.div>
                )}
                 {!showContent && (
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