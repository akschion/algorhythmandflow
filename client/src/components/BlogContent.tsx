import { motion } from "framer-motion";

interface BlogContentProps {
  content: string;
  variants?: any;  // Animation variants passed from parent
}

export default function BlogContent({ content, variants }: BlogContentProps) {
  return (
    <motion.div 
      variants={variants}
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
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}