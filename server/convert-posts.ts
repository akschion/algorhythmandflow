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
  const outputFile = path.join(process.cwd(), 'client', 'src', 'assets', 'posts.json');

  try {
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
        .use(remark2rehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(markdownContent);

      // Create post object with embedded HTML content
      const post = {
        id: file.replace('.md', ''),
        title: data.title || 'Untitled',
        slug: data.slug || file.replace('.md', ''),
        excerpt: data.excerpt || markdownContent.slice(0, 150) + '...',
        content: String(htmlContent),
        publishedAt: data.date || new Date().toISOString(),
        tags: data.tags || []
      };

      posts.push(post);
      console.log(`Converted ${file} to JSON with HTML content`);
    }

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Write to JSON file
    await fs.writeFile(outputFile, JSON.stringify(posts, null, 2));
    console.log('Successfully wrote posts to JSON file');

  } catch (error) {
    console.error('Error converting posts:', error);
  }
}

convertPosts().catch(console.error);