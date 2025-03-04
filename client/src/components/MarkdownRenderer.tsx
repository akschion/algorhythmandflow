// client/src/components/MarkdownRenderer.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css"; // Import Katex CSS

interface MarkdownRendererProps {
    markdownContent: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    markdownContent,
}) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
        >
            {markdownContent}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
