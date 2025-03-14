import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import { unified } from 'unified';

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
    console.log('Template loaded successfully');

    // Create routes to generate
    const routes = [
      { path: '', title: 'Home' },
      { path: 'about', title: 'About' },
      { path: 'blog', title: 'Blog' }
    ];

    // Generate HTML for each route
    for (const route of routes) {
      console.log(`Generating ${route.path || 'index'} page...`);
      const htmlContent = template
        .replace(/<title>.*?<\/title>/, `<title>${route.title} - Algorhythm + Flow</title>`)
        .replace('<div id="root"></div>', `<div id="root" data-page="${route.path || 'index'}"></div>`);

      // Create directory for each route (except home)
      const dirPath = route.path ? path.join(outputDir, route.path) : outputDir;
      await fs.mkdir(dirPath, { recursive: true });

      // Write both index.html in the directory and direct .html file
      if (route.path) {
        // Write index.html in the directory for clean URLs
        await fs.writeFile(path.join(dirPath, 'index.html'), htmlContent);
        // Also write direct .html file for direct access
        await fs.writeFile(path.join(outputDir, `${route.path}.html`), htmlContent);
      } else {
        // For home page, just write index.html in root
        await fs.writeFile(path.join(outputDir, 'index.html'), htmlContent);
      }
    }

    // Process and generate blog post pages
    const files = await fs.readdir(postsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    for (const file of markdownFiles) {
      const filePath = path.join(postsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
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

      // Create post directory and generate post page
      const postDir = path.join(outputDir, 'post', slug);
      await fs.mkdir(postDir, { recursive: true });

      const postPageContent = template
        .replace(/<title>.*?<\/title>/, `<title>${data.title} - Algorhythm + Flow</title>`)
        .replace('<div id="root"></div>', `<div id="root" data-page="post" data-slug="${slug}"></div>`);

      // Write both index.html in the directory and direct .html file
      await fs.writeFile(path.join(postDir, 'index.html'), postPageContent);
      await fs.writeFile(path.join(outputDir, `post-${slug}.html`), postPageContent);
    }

    console.log('\nSuccessfully generated all static pages');
  } catch (error) {
    console.error('Error generating pages:', error);
    process.exit(1);
  }
}

generatePages().catch(console.error);