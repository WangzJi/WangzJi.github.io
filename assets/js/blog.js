

// Blog Management Class
class BlogManager {
    constructor(dataService) {
        this.dataService = dataService;
        this.posts = [];
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.postsPerPage = 6;
        this.currentPage = 1;
        this.init();
    }

    async init() {
        this.posts = await this.dataService.fetchPosts();
        this.renderPosts();
        this.initSearch();
        this.initCategoryFilter();
        this.initLoadMore();
        this.initTypewriter();
    }

    renderPosts() {
        const filteredPosts = this.getFilteredPosts();
        const postsToShow = filteredPosts.slice(0, this.currentPage * this.postsPerPage);
        const postsGrid = document.getElementById('posts-grid');
        
        if (!postsGrid) return;

        postsGrid.innerHTML = postsToShow.map(post => this.createPostCard(post)).join('');
        
        // Update load more button visibility
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = filteredPosts.length > postsToShow.length ? 'flex' : 'none';
        }

        // Add animation to cards
        this.animateCards();
    }

    createPostCard(post) {
        return `
            <article class="post-card" data-category="${post.category}" onclick="this.navigateToPost(${post.id})">
                <div class="post-meta">
                    <span class="post-date">${this.formatDate(post.date)}</span>
                    <span class="post-category">${this.getCategoryName(post.category)}</span>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                </div>
                <div class="post-footer">
                    <span class="read-time">
                        <i class="fas fa-clock"></i> ${post.readTime}
                    </span>
                    <a href="post.html?id=${post.id}" class="post-link">
                        阅读全文 <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `;
    }

    getFilteredPosts() {
        return this.posts.filter(post => {
            const matchesCategory = this.currentCategory === 'all' || post.category === this.currentCategory;
            const matchesSearch = this.searchTerm === '' || 
                post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase()));
            
            return matchesCategory && matchesSearch;
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getCategoryName(category) {
        const categoryNames = {
            frontend: 'Frontend',
            backend: 'Backend',
            devops: 'DevOps',
            ai: 'AI/ML'
        };
        return categoryNames[category] || category;
    }

    initSearch() {
        const searchInput = document.getElementById('blog-search');
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchTerm = e.target.value;
                this.currentPage = 1;
                this.renderPosts();
            }, 300);
        });
    }

    initCategoryFilter() {
        const categoryTabs = document.querySelectorAll('.category-tab');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                categoryTabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Update current category
                this.currentCategory = tab.dataset.category;
                this.currentPage = 1;
                this.renderPosts();
            });
        });
    }

    initLoadMore() {
        const loadMoreBtn = document.getElementById('load-more');
        if (!loadMoreBtn) return;

        loadMoreBtn.addEventListener('click', () => {
            this.currentPage++;
            this.renderPosts();
        });
    }

    initTypewriter() {
        const searchCursor = document.querySelector('.search-cursor');
        if (searchCursor) {
            // Animate the cursor
            setInterval(() => {
                searchCursor.style.opacity = searchCursor.style.opacity === '0' ? '1' : '0';
            }, 800);
        }
    }

    animateCards() {
        const cards = document.querySelectorAll('.post-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // 导航到文章详情页
    navigateToPost(postId) {
        window.location.href = `post.html?id=${postId}`;
    }
}

// Utility Functions
function addRippleEffect(button) {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Add ripple effect styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 255, 136, 0.6);
        pointer-events: none;
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize Blog Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const blogManager = new BlogManager(dataService);
    
    // Add ripple effects to buttons
    const buttons = document.querySelectorAll('.category-tab, .load-more-btn');
    buttons.forEach(addRippleEffect);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BlogManager };
} 