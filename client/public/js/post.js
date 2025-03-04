// Get post slug from URL
function getSlugFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

// Load and display single post
async function loadPost() {
  const slug = getSlugFromUrl();
  if (!slug) {
    window.location.href = '/blog.html';
    return;
  }

  const posts = await window.blogUtils.fetchPosts();
  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    document.getElementById('post-content').innerHTML = '<div class="p-6">Post not found</div>';
    return;
  }

  // Update page title
  document.title = `${post.title} - Algorhythm and Flow`;

  // Load post content
  try {
    const response = await fetch(post.contentPath);
    if (!response.ok) throw new Error('Failed to load post content');
    const content = await response.text();

    // Display post
    const article = document.getElementById('post-content');
    article.innerHTML = `
      <div class="p-6">
        <div class="flex items-center gap-2 text-sm text-muted mb-3">
          <time datetime="${post.publishedAt}">${window.blogUtils.formatDate(post.publishedAt)}</time>
          <span>•</span>
          <div class="flex flex-wrap gap-2">
            ${post.tags.map(tag => 
              `<span class="text-xs px-2 py-1 bg-primary/10 rounded-full">${tag}</span>`
            ).join('')}
          </div>
        </div>
        
        <h1 class="text-3xl font-bold mb-6">${post.title}</h1>
        
        <div class="prose prose-lg">
          ${content}
        </div>
      </div>
    `;

    // Load sidebar with recent posts
    loadSidebar(posts, post.id);

  } catch (error) {
    console.error('Error loading post:', error);
    article.innerHTML = '<div class="p-6">Error loading post content</div>';
  }
}

// Load sidebar with recent posts
function loadSidebar(posts, currentPostId) {
  const recentPosts = posts
    .filter(p => p.id !== currentPostId)
    .slice(0, 3);

  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h2 class="text-xl gradient-text">Recent Posts</h2>
      </div>
      <div class="card-content">
        <div class="space-y-4">
          ${recentPosts.map(post => `
            <div class="group">
              <a 
                href="/post.html?slug=${post.slug}"
                class="text-sm font-medium group-hover:text-primary block"
              >
                ${post.title}
              </a>
              <div class="text-xs text-muted">
                ${window.blogUtils.formatDate(post.publishedAt)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// Initialize the post page
document.addEventListener('DOMContentLoaded', loadPost);
