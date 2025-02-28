import { posts, type Post, type InsertPost } from "@shared/schema";

export interface IStorage {
  getPosts(): Promise<Post[]>;
  getPost(slug: string): Promise<Post | undefined>;
  getPostsByTag(tag: string): Promise<Post[]>;
  searchPosts(query: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
}

export class MemStorage implements IStorage {
  private posts: Map<number, Post>;
  private currentId: number;

  constructor() {
    this.posts = new Map();
    this.currentId = 1;
  }

  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values())
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async getPost(slug: string): Promise<Post | undefined> {
    return Array.from(this.posts.values()).find(post => post.slug === slug);
  }

  async getPostsByTag(tag: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.tags.includes(tag))
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async searchPosts(query: string): Promise<Post[]> {
    const searchRegex = new RegExp(query, 'i');
    return Array.from(this.posts.values())
      .filter(post => 
        searchRegex.test(post.title) || 
        searchRegex.test(post.content) ||
        searchRegex.test(post.excerpt)
      )
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  // Add a sample post for demonstration purposes
  async addSamplePost(): Promise<void> {
    const samplePost: Post = {
      id: 999,
      title: "Exploring Modern Web Development Techniques",
      slug: "exploring-modern-web-development",
      content: "This is a sample blog post added to demonstrate vertical card layout. Modern web development involves various frameworks and libraries that make building interactive and responsive applications easier than ever before.",
      excerpt: "A look at current trends and best practices in web development.",
      publishedAt: new Date(2023, 11, 15),
      tags: ["Web Development", "JavaScript", "React"]
    };
    
    this.posts.set(samplePost.id, samplePost);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentId++;
    const post: Post = {
      ...insertPost,
      id,
      publishedAt: new Date()
    };
    this.posts.set(id, post);
    return post;
  }
}

export const storage = new MemStorage();

// Add some sample content
storage.createPost({
  title: "Introduction to Fourier Transforms",
  slug: "fourier-transforms-intro",
  content: `
# Introduction to Fourier Transforms

The Fourier transform is a fundamental tool in signal processing and analysis. It decomposes a function into the frequencies that make it up.

$$F(\\omega) = \\int_{-\\infty}^{\\infty} f(t)e^{-i\\omega t}dt$$

## Applications in Signal Processing

Code example:
\`\`\`python
import numpy as np

def fourier_transform(signal):
    return np.fft.fft(signal)
\`\`\`
`,
  excerpt: "An introduction to Fourier transforms and their applications in signal processing",
  tags: ["math", "signal-processing"]
});
