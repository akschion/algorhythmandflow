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

async function copyAssets(sourceDir: string, targetDir: string) {
  try {
    // Create target directory if it doesn't exist
    await fs.mkdir(targetDir, { recursive: true });

    // Read all files from source directory
    const files = await fs.readdir(sourceDir);

    // Copy each file to target directory, replacing spaces with underscores
    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const targetFileName = file.replace(/\s+/g, '_');
      const targetPath = path.join(targetDir, targetFileName);

      await fs.copyFile(sourcePath, targetPath);
      console.log(`Copied ${file} to ${targetFileName}`);
    }
  } catch (error) {
    console.error('Error copying assets:', error);
  }
}

async function convertPosts() {
  const postsDir = path.join(path.dirname(__dirname), 'server', 'posts');
  const contentDir = path.join(path.dirname(__dirname), 'client', 'public', 'blog-content');
  const outputFile = path.join(path.dirname(__dirname), 'client', 'src', 'assets', 'posts.json');

  // Define source and target asset directories
  const sourceAssetsDir = path.join(postsDir, 'assets');
  const targetAssetsDir = path.join(contentDir, 'assets');

  try {
    // Ensure content and assets directories exist
    await fs.mkdir(contentDir, { recursive: true });
    await fs.mkdir(targetAssetsDir, { recursive: true });

    // Copy assets from source to target, replacing spaces with underscores
    await copyAssets(sourceAssetsDir, targetAssetsDir);

    const files = await fs.readdir(postsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const posts = [];

    for (const file of markdownFiles) {
      const filePath = path.join(postsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: markdownContent } = matter(content);

      // Replace image paths in markdown content
      const updatedContent = markdownContent.replace(
        /!\[(.*?)\]\("?assets\/(.*?)"?\)/g,
        (match, alt, imagePath) => {
          const updatedImagePath = imagePath.replace(/\s+/g, '_');
          return `![${alt}](/blog-content/assets/${updatedImagePath})`;
        }
      );

      // Convert markdown to HTML while preserving existing HTML
      let htmlContent = await unified()
        .use(remarkParse, { commonmark: true })
        .use(remarkMath)
        .use(remarkGfm)
        .use(remark2rehype, { 
          allowDangerousHtml: true,
          passThrough: ['div', 'img', 'style']
        })
        .use(rehypeKatex)
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(updatedContent);

      // Fix image paths in HTML content for img tags within HTML
      let htmlString = String(htmlContent);
      htmlString = htmlString.replace(
        /src="assets\/(.*?)"/g,
        'src="/blog-content/assets/$1"'
      );

      // Generate HTML filename
      const htmlFileName = `${file.replace('.md', '')}.html`;
      const contentPath = `/blog-content/${htmlFileName}`;

      // Write HTML content to file in public directory
      await fs.writeFile(
        path.join(contentDir, htmlFileName),
        `<div class="blog-content">
          <style>
            /* Ensure consistent styling for KaTeX equations and images */
            .katex { color: white !important; }
            .katex-display { 
              color: white !important;
              text-align: center !important;
              margin: 1em 0 !important;
              overflow-x: auto !important;
              overflow-y: hidden !important;
              padding: 1em 0 !important;
            }
            .katex-display > .katex {
              display: inline-block !important;
              text-align: center !important;
              width: 100% !important;
            }
            .katex .mord, .katex .mrel, .katex .mop, .katex .mopen, .katex .mclose, 
            .katex .mpunct, .katex .minner, .katex .mbin { color: white !important; }

            /* Center all images and ensure they appear above the grid */
            .blog-content img {
              display: block;
              margin: 2rem auto;
              max-width: 100%;
              height: auto;
              position: relative;
              z-index: 10;
            }

            /* Ensure all content is above the grid */
            .blog-content {
              position: relative;
              z-index: 5;
            }

            /* Tables should also appear above the grid */
            .blog-content table {
              position: relative;
              z-index: 10;
            }

            /* Handle long equations */
            @media screen and (max-width: 768px) {
              .katex-display {
                font-size: 0.9em !important;
              }
              .katex-html {
                max-width: 100% !important;
                overflow-x: auto !important;
                overflow-y: hidden !important;
              }
            }
          </style>
          ${htmlString}
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