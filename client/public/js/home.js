// Load recent posts on the home page
async function loadRecentPosts() {
  const posts = await window.blogUtils.fetchPosts();
  const recentPosts = posts.slice(0, 3);
  
  const container = document.getElementById('recent-posts');
  if (!container) return;

  recentPosts.forEach(post => {
    const card = window.blogUtils.createPostCard(post);
    container.appendChild(card);
  });
}

// Initialize the home page
document.addEventListener('DOMContentLoaded', () => {
  loadRecentPosts();
});
