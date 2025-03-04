import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import { unified } from 'unified';

async function convertPosts() {
  const postsDir = path.join(process.cwd(), 'server', 'posts');
  const outputDir = path.join(process.cwd(), 'client', 'src', 'assets', 'posts');

  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    const files = await fs.readdir(postsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    for (const file of markdownFiles) {
      const filePath = path.join(postsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: markdownContent } = matter(content);

      // Convert markdown to HTML
      const htmlContent = await unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remark2rehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(markdownContent);

      // Create a clean HTML document
      const fullHtml = `
<article class="markdown-content">
${String(htmlContent)}
</article>`;

      // Write to output file
      const outputPath = path.join(outputDir, file.replace('.md', '.html'));
      await fs.writeFile(outputPath, fullHtml);
      console.log(`Converted ${file} to HTML`);
    }
  } catch (error) {
    console.error('Error converting posts:', error);
  }
}

convertPosts().catch(console.error);
