import { type Post } from "@shared/schema";

export function generateRSSFeed(posts: Post[]): string {
  const items = posts.map(post => `
    <item>
      <title>${escapeXML(post.title)}</title>
      <link>/post/${post.slug}</link>
      <description>${escapeXML(post.excerpt)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <guid>/post/${post.slug}</guid>
    </item>
  `).join("");

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Academic Blog</title>
    <link>/</link>
    <description>Mathematics, Technology, and Hip-Hop Culture</description>
    ${items}
  </channel>
</rss>`;
}

function escapeXML(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
