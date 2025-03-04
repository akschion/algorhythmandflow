import type { Post } from "@shared/schema";

// Import posts metadata
const postsJson = await import("../assets/posts.json");

// Function to load posts from static JSON file
export async function getPosts(): Promise<Post[]> {
  const posts = postsJson.default;
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

  try {
    // Remove the leading '/posts/' from contentPath if it exists
    const cleanPath = post.contentPath.replace(/^\/posts\//, '');
    // Fetch the HTML content directly
    const response = await fetch(`/assets/posts/${cleanPath}`);
    if (!response.ok) {
      throw new Error(`Failed to load post content: ${response.statusText}`);
    }
    const content = await response.text();

    return {
      ...post,
      content
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
    post.title.toLowerCase().includes(searchTerm)
  );
}