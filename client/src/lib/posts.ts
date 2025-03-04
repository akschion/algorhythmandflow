import type { Post } from "@shared/schema";

// Import posts metadata
import postsJson from "../assets/posts.json";

// Function to load posts from static JSON file
export async function getPosts(): Promise<Post[]> {
  return postsJson.map((post: any) => ({
    ...post,
    publishedAt: new Date(post.publishedAt)
  }));
}

// Function to load a single post by slug
export async function getPost(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  const post = posts.find(post => post.slug === slug);

  if (!post) {
    return undefined;
  }

  try {
    // Ensure we have an absolute URL for the content
    const contentUrl = new URL(post.contentPath, window.location.origin).href;
    console.log('Fetching content from:', contentUrl); // Debug log

    const response = await fetch(contentUrl);
    if (!response.ok) {
      throw new Error(`Failed to load post content: ${response.statusText}`);
    }
    const content = await response.text();
    console.log('Loaded content:', content); // Debug log

    return {
      ...post,
      content,
      publishedAt: new Date(post.publishedAt)
    };
  } catch (error) {
    console.error('Failed to load post content:', error);
    return undefined;
  }
}

// Function to load posts by tag
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter(post => post.tags.includes(tag));
}

// Function to search posts
export async function searchPosts(query: string): Promise<Post[]> {
  const posts = await getPosts();
  const searchTerm = query.toLowerCase();
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm)
  );
}