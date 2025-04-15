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

      // Process grid layout comments and images - replace asset paths
      console.log("Processing markdown content...");
      const updatedContent = markdownContent.replace(
        /!\[(.*?)\]\("?assets\/(.*?)"?(?:\s+"(.*?)")?\)/g,
        (match, alt, imagePath, caption) => {
          const updatedImagePath = imagePath.replace(/\s+/g, '_');
          return `![${alt}](/blog-content/assets/${updatedImagePath}${caption ? ` "${caption}"` : ''})`;
        }
      );

      // Convert markdown to HTML
      const htmlContent = await unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkGfm)
        .use(remark2rehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(updatedContent);

      // Wrap tables with a responsive container so they scroll horizontally when needed
      let htmlContentString = String(htmlContent);
      
      // Process HTML to add captions to images after conversion
      // Instead of using matchAll which causes TypeScript error, use a regular expression to find all matches
      const imgRegex = /!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g;
      let imgMatch;
      
      while ((imgMatch = imgRegex.exec(markdownContent)) !== null) {
        const [fullMatch, alt, path, captionRaw] = imgMatch;
        
        // Parse caption and optional max-width if present
        // Format: "Caption text|maxwidth=500px" or just "Caption text"
        let caption = captionRaw;
        let maxWidth = null;
        
        if (caption) {
          if (caption.includes('|maxwidth=')) {
            const parts = caption.split('|maxwidth=');
            caption = parts[0].trim();
            maxWidth = parts[1].trim();
          }
          
          const imgPath = path.includes('assets/') 
            ? `/blog-content/assets/${path.split('assets/')[1].replace(/\s+/g, '_').replace(/["']/g, '')}`
            : path;
            
          // Build style attribute for custom max-width if specified
          const styleAttr = maxWidth ? ` style="max-width: ${maxWidth};"` : '';
          
          // Find the image in processed HTML and wrap it with caption
          const imgHtmlRegex = new RegExp(`<img([^>]*?)src="${imgPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"([^>]*?)>`, 'g');
          
          // Replace the full raw caption in title attribute (that includes maxwidth) with just the caption text
          htmlContentString = htmlContentString.replace(
            new RegExp(`title="${captionRaw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
            `title="${caption}"`
          );
          
          // Now apply the figure and caption
          htmlContentString = htmlContentString.replace(
            imgHtmlRegex,
            `<figure class="image-with-caption">
              <img$1src="${imgPath}"${styleAttr}$2>
              <figcaption>${caption}</figcaption>
            </figure>`
          );
        }
      }
      
      // Final HTML processing
      const finalHtmlContent = htmlContentString
        .replace(/<table([\s\S]*?)>/g, '<div class="table-responsive"><table$1>')
        .replace(/<\/table>/g, '</table></div>');

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

            /* Grid layout for images */
            .image-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 1rem;
              margin: 2rem 0;
              position: relative;
              z-index: 10;
            }
            .image-grid img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              margin: 0;
            }
            /* Default image styling */
            .blog-content img:not(.image-grid img) {
              display: block;
              margin: 2rem auto;
              max-width: 100%; /* Will fill container when small */
              width: auto;
              height: auto;
              position: relative;
              z-index: 10;
            }
            
            @media (min-width: 800px) {
              .blog-content img:not(.image-grid img) {
                max-width: 750px; /* Max width in pixels when container is large enough */
              }
            }
            
            /* Image with caption styling */
            .image-with-caption {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin: 2rem auto;
              text-align: center;
              width: 100%;
            }
            
            .image-with-caption img {
              max-width: 100%; /* Fill container when small */
              width: auto;
              margin: 0 0 0.5rem 0;
            }
            
            @media (min-width: 800px) {
              .image-with-caption img {
                max-width: 750px; /* Max width in pixels when container is large enough */
              }
            }
            
            .image-with-caption figcaption {
              font-size: 1rem; /* Normal size font */
              font-style: italic;
              color: white; /* White text for better contrast */
              margin-top: 0.5rem;
              max-width: 85%;
              text-align: center;
            }
            /* Ensure all content is above the grid */
            .blog-content {
              position: relative;
              z-index: 5;
            }
            /* Tables should also appear above the grid and be centered */
            .blog-content table {
              position: relative;
              z-index: 10;
              margin: auto;
              text-align: center;
            }
            .blog-content table th,
            .blog-content table td {
              text-align: center;
            }
            /* Responsive table container for horizontal scrolling */
            .table-responsive {
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
            }
            /* Handle long equations on smaller screens */
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
          ${finalHtmlContent}
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
