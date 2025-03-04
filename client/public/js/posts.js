// Fetch and parse blog posts
async function fetchPosts() {
  try {
    // Use relative path from root
    const response = await fetch('/blog-content/posts.json');
    if (!response.ok) {
      throw new Error('Failed to load posts');
    }
    const posts = await response.json();
    return posts.map(post => ({
      ...post,
      publishedAt: new Date(post.publishedAt)
    }));
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
}

// Format date for display
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

// Create a post card element
function createPostCard(post, isPreview = true) {
  const article = document.createElement('article');
  article.className = 'card hover:shadow-lg transition-shadow';

  const dateStr = formatDate(post.publishedAt);
  const tagsHtml = post.tags.map(tag => 
    `<span class="text-xs px-2 py-1 bg-primary/10 rounded-full">${tag}</span>`
  ).join('');

  article.innerHTML = `
    <div class="p-6">
      <div class="flex items-center gap-2 text-sm text-muted mb-3">
        <time datetime="${post.publishedAt}">${dateStr}</time>
        <span>•</span>
        <div class="flex flex-wrap gap-2">
          ${tagsHtml}
        </div>
      </div>

      <h2 class="text-xl font-bold mb-3">
        <a href="/post.html?slug=${post.slug}" class="hover:text-primary">
          ${post.title}
        </a>
      </h2>

      <p class="text-muted-foreground line-clamp-3">
        ${post.excerpt}
      </p>
    </div>
  `;

  return article;
}

// Export functions for use in other scripts
window.blogUtils = {
  fetchPosts,
  formatDate,
  createPostCard
};