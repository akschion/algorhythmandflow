// Handle tag filtering
let selectedTags = new Set();

function toggleTag(tag) {
  if (selectedTags.has(tag)) {
    selectedTags.delete(tag);
  } else {
    selectedTags.add(tag);
  }
  updatePageTitle();
  loadPosts();
}

function updatePageTitle() {
  const title = document.getElementById('page-title');
  if (selectedTags.size > 0) {
    title.textContent = `Posts tagged: ${Array.from(selectedTags).join(", ")}`;
  } else {
    title.textContent = "All Posts";
  }
}

function createTagButton(tag, isSelected) {
  const button = document.createElement('button');
  button.className = `px-3 py-1 rounded-full text-sm ${
    isSelected 
      ? 'bg-primary text-white' 
      : 'bg-primary/10 hover:bg-primary hover:text-white'
  }`;
  button.textContent = tag;
  button.onclick = () => toggleTag(tag);
  return button;
}

// Load and display posts
async function loadPosts() {
  const posts = await window.blogUtils.fetchPosts();
  
  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));
  
  // Update tags container
  const tagsContainer = document.getElementById('tags-container');
  tagsContainer.innerHTML = '';
  allTags.forEach(tag => {
    const tagButton = createTagButton(tag, selectedTags.has(tag));
    tagsContainer.appendChild(tagButton);
  });
  
  // Filter posts based on selected tags
  const filteredPosts = selectedTags.size > 0
    ? posts.filter(post => 
        Array.from(selectedTags).every(tag => post.tags.includes(tag))
      )
    : posts;
  
  // Update posts container
  const postsContainer = document.getElementById('posts-container');
  postsContainer.innerHTML = '';
  
  if (filteredPosts.length === 0) {
    postsContainer.innerHTML = '<div class="text-center py-8">No posts found</div>';
    return;
  }
  
  filteredPosts.forEach(post => {
    const postCard = window.blogUtils.createPostCard(post);
    postsContainer.appendChild(postCard);
  });
}

// Initialize the blog page
document.addEventListener('DOMContentLoaded', loadPosts);
