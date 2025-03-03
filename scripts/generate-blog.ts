import fs from 'fs-extra';
import path from 'path';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import { unified } from 'unified';
import { fileURLToPath } from 'url'; // Import fileURLToPath from 'url'
import { dirname } from 'path';     // Import dirname from 'path'

const __filename = fileURLToPath(import.meta.url); // Get __filename
const __dirname = dirname(__filename);             // Get __dirname

const postsDir = path.join(__dirname, '..', 'server', 'posts'); // Path to your markdown files
const outputDir = path.join(__dirname, '..', 'dist', 'public', 'blog'); // Output directory for HTML
const postsInfoDir = path.join(__dirname, '..', 'dist', 'public', 'data'); // Output directory for posts.json

async function generateBlogPosts() {
    try {
        // Ensure output directories exist, create if not
        await fs.ensureDir(outputDir);
        await fs.ensureDir(postsInfoDir);

        const files = await fs.readdir(postsDir);
        const markdownFiles = files.filter(file => file.endsWith('.md'));

        const postListForJson = [];

        for (const file of markdownFiles) {
            const markdownFilePath = path.join(postsDir, file);
            const htmlFileName = path.basename(file, '.md') + '.html';
            const htmlFilePath = path.join(outputDir, htmlFileName);

            const markdownContent = await fs.readFile(markdownFilePath, 'utf8');
            const { data, content: mdContent } = matter(markdownContent);

            // Process markdown to HTML using unified pipeline with KaTeX support
            const htmlContent = await unified()
                .use(remarkParse)
                .use(remarkMath)
                .use(remark2rehype)
                .use(rehypeKatex)
                .use(rehypeStringify)
                .process(mdContent)
                .then(file => file.value.toString());


            // Wrap the HTML content in a basic page structure
            const fullHtmlPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title || 'Blog Post'}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-姒Ql5rY/rQH3Rml2a+kWk9qeQfJ+Q5bJ/s1vRz9pQTnAQ3e3VpD0o6e5p9yW3/s" crossorigin="anonymous">
    </head>
<body>
    <article class="blog-post">
        ${htmlContent}
    </article>
</body>
</html>
            `;

            await fs.writeFile(htmlFilePath, fullHtmlPage);
            console.log(`Converted ${file} to ${htmlFileName}`);

            postListForJson.push({
                // id: data.id, // Include id from frontmatter if you have it, otherwise remove if not needed in posts.json
                title: data.title || 'Untitled',
                slug: data.slug || path.basename(file, '.md'),
                excerpt: data.excerpt || mdContent.slice(0, 150) + '...', // Generate excerpt
                tags: data.tags || [] // Include tags in posts.json
            });
        }

        await fs.writeFile(path.join(postsInfoDir, 'posts.json'), JSON.stringify(postListForJson, null, 2));
        console.log('posts.json generated');

        console.log('Markdown to HTML conversion complete with KaTeX support!');

    } catch (error) {
        console.error('Error generating blog posts:', error);
    }
}

generateBlogPosts();
