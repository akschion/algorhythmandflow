import type { Post } from "@shared/schema";

// Function to load posts from static JSON file
export async function getPosts(): Promise<Post[]> {
  const response = await fetch('/posts.json');
  const posts = await response.json();
  return posts.map((post: any) => ({
    ...post,
    publishedAt: new Date(post.publishedAt)
  }));
}

// Function to load a single post by slug
export async function getPost(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find(post => post.slug === slug);
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
    post.content.toLowerCase().includes(searchTerm)
  );
}
