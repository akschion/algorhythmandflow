import type { Post } from "@shared/schema";

// Function to load posts from static JSON file
export async function getPosts(): Promise<Post[]> {
  const response = await fetch('/assets/posts.json');
  if (!response.ok) {
    throw new Error('Failed to load posts');
  }
  const posts = await response.json();
  return posts.map((post: any) => ({
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

  // Load the HTML content
  const contentResponse = await fetch(`/assets/posts/${post.contentPath}`);
  if (!contentResponse.ok) {
    throw new Error('Failed to load post content');
  }
  const content = await contentResponse.text();

  return {
    ...post,
    content
  };
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
    post.title.toLowerCase().includes(searchTerm)
  );
}