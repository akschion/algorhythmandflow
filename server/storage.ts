
import { posts, type Post, type InsertPost } from "@shared/schema";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface IStorage {
  getPosts(): Promise<Post[]>;
  getPost(slug: string): Promise<Post | undefined>;
  getPostsByTag(tag: string): Promise<Post[]>;
  searchPosts(query: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
}

export class FileStorage implements IStorage {
  private postsDir: string;
  private postsCache: Post[] | null = null;
  private currentId: number = 1;

  constructor(postsDir: string) {
    this.postsDir = postsDir;
  }

  private async loadPostsIfNeeded(): Promise<Post[]> {
    if (this.postsCache) {
      return this.postsCache;
    }

    try {
      const files = await fs.readdir(this.postsDir);
      const markdownFiles = files.filter(file => file.endsWith('.md'));
      
      const posts: Post[] = [];
      
      for (const file of markdownFiles) {
        const filePath = path.join(this.postsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const { data, content: markdownContent } = matter(content);
        
        // Extract data from frontmatter
        const post: Post = {
          id: this.currentId++,
          title: data.title || 'Untitled',
          slug: data.slug || file.replace('.md', ''),
          content: markdownContent,
          excerpt: data.excerpt || markdownContent.slice(0, 150) + '...',
          publishedAt: data.date ? new Date(data.date) : new Date(),
          tags: data.tags || []
        };
        
        posts.push(post);
      }
      
      // Sort by publication date (newest first)
      posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
      
      this.postsCache = posts;
      return posts;
    } catch (error) {
      console.error('Error loading posts:', error);
      return [];
    }
  }

  async getPosts(): Promise<Post[]> {
    return this.loadPostsIfNeeded();
  }

  async getPost(slug: string): Promise<Post | undefined> {
    const posts = await this.loadPostsIfNeeded();
    return posts.find(post => post.slug === slug);
  }

  async getPostsByTag(tag: string): Promise<Post[]> {
    const posts = await this.loadPostsIfNeeded();
    return posts.filter(post => post.tags.includes(tag));
  }

  async searchPosts(query: string): Promise<Post[]> {
    const posts = await this.loadPostsIfNeeded();
    const searchRegex = new RegExp(query, 'i');
    
    return posts.filter(post => 
      searchRegex.test(post.title) || 
      searchRegex.test(post.content) ||
      searchRegex.test(post.excerpt)
    );
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    // For file-based storage, we'll create a new markdown file
    const { title, slug, content, excerpt, tags } = insertPost;
    
    // Create frontmatter
    const frontmatter = {
      title,
      slug,
      excerpt,
      date: new Date().toISOString(),
      tags
    };
    
    const fileContent = matter.stringify(content, frontmatter);
    const fileName = `${slug}.md`;
    
    await fs.writeFile(path.join(this.postsDir, fileName), fileContent);
    
    // Invalidate cache to reload posts
    this.postsCache = null;
    
    // Return the newly created post
    const id = this.currentId++;
    const post: Post = {
      ...insertPost,
      id,
      publishedAt: new Date()
    };
    
    return post;
  }
}

// Initialize storage with posts directory
export const storage = new FileStorage(path.join(process.cwd(), 'server', 'posts'));

// Add gray-matter to package.json
