import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import { unified } from 'unified';

async function convertPosts() {
  // Use __dirname for relative path resolution in ES modules
  const postsDir = path.join(path.dirname(__dirname), 'server', 'posts');
  const contentDir = path.join(path.dirname(__dirname), 'client', 'public', 'blog-content');
  const outputFile = path.join(path.dirname(__dirname), 'client', 'src', 'assets', 'posts.json');

  try {
    // Ensure content directory exists
    await fs.mkdir(contentDir, { recursive: true });

    const files = await fs.readdir(postsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const posts = [];

    for (const file of markdownFiles) {
      const filePath = path.join(postsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: markdownContent } = matter(content);

      // Convert markdown to HTML
      const htmlContent = await unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkGfm) // Add GitHub Flavored Markdown support (including tables)
        .use(remark2rehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(markdownContent);

      // Generate HTML filename
      const htmlFileName = `${file.replace('.md', '')}.html`;
      const contentPath = `/blog-content/${htmlFileName}`; // Path relative to public directory

      // Write HTML content to file in public directory
      await fs.writeFile(
        path.join(contentDir, htmlFileName),
        `<div class="blog-content">
          <style>
            /* Ensure consistent styling for KaTeX equations */
            .katex { color: white !important; }
            .katex-display { color: white !important; }
            .katex .mord, .katex .mrel, .katex .mop, .katex .mopen, .katex .mclose, 
            .katex .mpunct, .katex .minner, .katex .mbin { color: white !important; }
          </style>
          ${String(htmlContent)}
        </div>`
      );

      // Create post metadata object
      const post = {
        id: file.replace('.md', ''),
        title: data.title || 'Untitled',
        slug: data.slug || file.replace('.md', ''),
        excerpt: data.excerpt || markdownContent.slice(0, 150) + '...',
        contentPath,
        publishedAt: data.date || new Date().toISOString(),
        tags: data.tags || []
      };

      posts.push(post);
      console.log(`Converted ${file} to HTML and saved metadata`);
    }

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Write metadata to JSON file
    await fs.writeFile(outputFile, JSON.stringify(posts, null, 2));
    console.log('Successfully wrote posts metadata to JSON file');

  } catch (error) {
    console.error('Error converting posts:', error);
  }
}

// Run the script directly if executed from command line
if (import.meta.url === `file://${process.argv[1]}`) {
  convertPosts().catch(error => {
    console.error('Failed to convert posts:', error);
    process.exit(1);
  });
}

// Export for potential programmatic use
export { convertPosts };