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
    await fs.mkdir(targetDir, { recursive: true });
    const files = await fs.readdir(sourceDir);

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

  const sourceAssetsDir = path.join(postsDir, 'assets');
  const targetAssetsDir = path.join(contentDir, 'assets');

  try {
    await fs.mkdir(contentDir, { recursive: true });
    await fs.mkdir(targetAssetsDir, { recursive: true });
    await copyAssets(sourceAssetsDir, targetAssetsDir);

    const files = await fs.readdir(postsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    const posts = [];

    for (const file of markdownFiles) {
      const filePath = path.join(postsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: markdownContent } = matter(content);

      let updatedContent = markdownContent;
      const gridRegex = /<!--\s*(\d+)\s*x\s*(\d+)\s*-->\n((?:!\[.*?\]\(.*?\)\n?)+)/g;

      updatedContent = updatedContent.replace(gridRegex, (match: string, cols: string, rows: string, imageBlock: string) => {
        const images = imageBlock.match(/!\[.*?\]\(.*?\)/g) || [];
        const gridImages = images.map((img: string) => {
          const updatedImg = img.replace(
            /!\[(.*?)\]\("?assets\/(.*?)"?\)/,
            (m: string, alt: string, imagePath: string) => {
              const updatedImagePath = imagePath.replace(/\s+/g, '_');
              return `![${alt}](/blog-content/assets/${updatedImagePath})`;
            }
          );
          return `<div class="grid-item">${updatedImg}</div>`;
        }).join('\n');

        return `<div class="image-grid" style="--grid-cols: ${cols};">
${gridImages}
</div>`;
      });

      const styleBlock = `
        <style>
          /* Image grid styling */
          .image-grid {
            display: grid;
            grid-template-columns: repeat(var(--grid-cols, 1), minmax(0, 1fr));
            gap: 1.5rem;
            margin: 2rem auto;
            max-width: 1200px;
            width: 100%;
            position: relative;
            z-index: 10;
          }

          .grid-item {
            position: relative;
            width: 100%;
            padding-top: 75%; /* 4:3 Aspect Ratio */
            overflow: hidden;
            border-radius: 0.5rem;
            background: rgba(0, 0, 0, 0.1);
          }

          .grid-item img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            margin: 0;
            transition: all 0.3s ease;
          }

          .grid-item:hover img {
            transform: scale(1.05);
          }

          /* Responsive breakpoints */
          @media (max-width: 1400px) {
            .image-grid {
              max-width: 1000px;
            }
          }

          @media (max-width: 1200px) {
            .image-grid {
              --grid-cols: min(var(--grid-cols), 2) !important;
              max-width: 800px;
              gap: 1.25rem;
            }
          }

          @media (max-width: 768px) {
            .image-grid {
              grid-template-columns: 1fr !important;
              gap: 1rem;
              max-width: 100%;
            }

            .grid-item {
              padding-top: 66.67%; /* 3:2 Aspect Ratio for mobile */
            }
          }
        </style>
      `;

      updatedContent = styleBlock + updatedContent;

      // Handle remaining single images
      updatedContent = updatedContent.replace(
        /!\[(.*?)\]\("?assets\/(.*?)"?\)/g,
        (match: string, alt: string, imagePath: string) => {
          const updatedImagePath = imagePath.replace(/\s+/g, '_');
          return `![${alt}](/blog-content/assets/${updatedImagePath})`;
        }
      );

      const htmlContent = await unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkGfm)
        .use(remark2rehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(updatedContent);

      const htmlFileName = `${file.replace('.md', '')}.html`;
      const contentPath = `/blog-content/${htmlFileName}`;

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
            .blog-content img:not(.grid-item img) {
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
          ${String(htmlContent)}
        </div>`
      );

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

    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    await fs.writeFile(outputFile, JSON.stringify(posts, null, 2));
    console.log('Successfully wrote posts metadata to JSON file');

  } catch (error) {
    console.error('Error converting posts:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  convertPosts().catch(error => {
    console.error('Failed to convert posts:', error);
    process.exit(1);
  });
}

export { convertPosts };