// scripts/generate-rss.ts
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

// Polyfill __dirname in ESM/tsx
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PostMeta {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  tags?: string[];
}

async function generateRSS() {
  // —— CONFIG ——
  const siteUrl = 'https://algorhythmandflow.com';
  const feedTitle = 'Algorhythm + Flow';
  const feedDescription = 'By Akshay Chandrasekhar. Documenting my research and hot takes on the interesting concepts bridging the real world and our imagination. Mostly focused on math, tech, and hip-hop, but includes other random topics as well.';
  const ttlMinutes = 60; // How long in minutes to cache the feed
  const iconPath = '/math-vinyl-icon.png'; // public asset for channel image
  // ————————

  const outFile = path.join(path.dirname(__dirname), 'client', 'public', 'rss.xml');
  const postsDir = path.join(path.dirname(__dirname), 'server', 'posts');

  // 1) Read all .md files
  const files = (await fs.readdir(postsDir)).filter((f) => f.endsWith('.md'));

  // 2) Parse front-matter
  const posts: PostMeta[] = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(postsDir, file), 'utf-8');
      const { data } = matter(raw);
      return {
        title: String(data.title),
        slug: String(data.slug),
        excerpt: String(data.excerpt),
        date: String(data.date),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      };
    })
  );

  // 3) Sort newest first
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 4) Build each <item>
  const itemsXml = posts
    .map((post) => {
      const categoriesXml = (post.tags || [])
        .map((tag) => `      <category><![CDATA[${tag}]]></category>`)
        .join('\n');

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/post/${post.slug}</link>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${siteUrl}/post/${post.slug}</guid>
${categoriesXml}
    </item>`;
    })
    .join('\n');

  // 5) Wrap in <rss> with atom namespace + extras
  const nowUtc = new Date().toUTCString();
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${feedTitle}]]></title>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <link>${siteUrl}</link>
    <description><![CDATA[${feedDescription}]]></description>
    <language>en-us</language>
    <pubDate>${nowUtc}</pubDate>
    <lastBuildDate>${nowUtc}</lastBuildDate>
    <ttl>${ttlMinutes}</ttl>
    <image>
      <url>${siteUrl}${iconPath}</url>
      <title><![CDATA[${feedTitle}]]></title>
      <link>${siteUrl}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;

  // 6) Write it out
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, rss.trim(), 'utf-8');
  console.log(`✅ RSS feed generated at ${outFile}`);
}

generateRSS().catch((err) => {
  console.error(err);
  process.exit(1);
});
