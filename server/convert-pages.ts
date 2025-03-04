import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import { unified } from 'unified';

// This script generates static HTML files for each route
async function generatePages() {
  const outputDir = path.join(process.cwd(), 'dist', 'public');
  const templatePath = path.join(process.cwd(), 'client', 'index.html');
  const postsDir = path.join(process.cwd(), 'server', 'posts');
  const contentDir = path.join(outputDir, 'blog-content');

  try {
    // Ensure output directories exist
    await fs.mkdir(outputDir, { recursive: true });
    await fs.mkdir(contentDir, { recursive: true });

    // Read the template HTML
    const template = await fs.readFile(templatePath, 'utf-8');

    // Create routes to generate
    const routes = [
      { path: 'index.html', title: 'Home' },
      { path: 'about.html', title: 'About' },
      { path: 'blog.html', title: 'Blog' }
    ];

    // Generate HTML for each route
    for (const route of routes) {
      const htmlContent = template
        .replace(/<title>.*?<\/title>/, `<title>${route.title} - Algorhythm and Flow</title>`)
        .replace('<div id="root"></div>', `<div id="root" data-page="${route.path}"></div>`);

      await fs.writeFile(path.join(outputDir, route.path), htmlContent);
      console.log(`Generated ${route.path}`);
    }

    // Process and generate blog post pages
    const files = await fs.readdir(postsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    for (const file of markdownFiles) {
      const content = await fs.readFile(path.join(postsDir, file), 'utf-8');
      const { data, content: markdownContent } = matter(content);
      const slug = data.slug || file.replace('.md', '');

      // Convert markdown to HTML
      const htmlContent = await unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remark2rehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(markdownContent);

      // Create the blog content HTML file
      const contentFileName = `${slug}.html`;
      await fs.writeFile(
        path.join(contentDir, contentFileName),
        `<div class="blog-content">${String(htmlContent)}</div>`
      );

      // Generate the post page HTML
      const postPageContent = template
        .replace(/<title>.*?<\/title>/, `<title>${data.title} - Algorhythm and Flow</title>`)
        .replace('<div id="root"></div>', `<div id="root" data-page="post" data-slug="${slug}"></div>`);

      await fs.writeFile(path.join(outputDir, `post-${slug}.html`), postPageContent);
      console.log(`Generated post page and content for ${slug}`);
    }

    console.log('Successfully generated all static pages');
  } catch (error) {
    console.error('Error generating pages:', error);
    process.exit(1);
  }
}

generatePages().catch(console.error);