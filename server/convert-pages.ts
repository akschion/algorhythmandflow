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
      { path: 'index.html', title: 'Home' },
      { path: 'about.html', title: 'About' },
      { path: 'blog.html', title: 'Blog' }
    ];

    // Generate HTML for each route
    for (const route of routes) {
      console.log(`Generating ${route.path}...`);
      const htmlContent = template
        .replace(/<title>.*?<\/title>/, `<title>${route.title} - Algorhythm and Flow</title>`)
        .replace('<div id="root"></div>', `<div id="root" data-page="${route.path.replace('.html', '')}"></div>`);

      const outputPath = path.join(outputDir, route.path);
      await fs.writeFile(outputPath, htmlContent);
      console.log(`Generated ${route.path} at ${outputPath}`);
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
      const contentFilePath = path.join(contentDir, contentFileName);
      await fs.writeFile(
        contentFilePath,
        `<div class="blog-content">${String(htmlContent)}</div>`
      );
      console.log(`Generated blog content at ${contentFilePath}`);

      // Generate the post page HTML
      const postPageContent = template
        .replace(/<title>.*?<\/title>/, `<title>${data.title} - Algorhythm and Flow</title>`)
        .replace('<div id="root"></div>', `<div id="root" data-page="post" data-slug="${slug}"></div>`);

      const postPagePath = path.join(outputDir, `post-${slug}.html`);
      await fs.writeFile(postPagePath, postPageContent);
      console.log(`Generated post page at ${postPagePath}`);
    }

    // List all generated files
    const generatedFiles = await fs.readdir(outputDir);
    console.log('\nGenerated files in output directory:');
    console.log(generatedFiles);

    console.log('\nSuccessfully generated all static pages');
  } catch (error) {
    console.error('Error generating pages:', error);
    process.exit(1);
  }
}

generatePages().catch(console.error);