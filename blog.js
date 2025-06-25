// Blog Data - 在实际项目中，这些数据应该来自后端 API 或 CMS
const blogPosts = [
    {
        id: 7,
        title: "深入解析Seata TM模块：分布式事务管理器的设计与实现",
        excerpt: "深入分析Seata框架中TM（Transaction Manager）模块的架构设计、核心实现和扩展机制，探讨分布式事务管理的最佳实践。",
        content: "深入分析Seata框架中TM模块的完整实现...",
        category: "backend",
        tags: ["Seata", "分布式事务", "微服务", "Java"],
        date: "2024-01-20",
        readTime: "25 min read",
        author: "Eric Wang"
    },
    {
        id: 1,
        title: "React 18 新特性详解：并发渲染与自动批处理",
        excerpt: "深入探讨 React 18 中的并发特性、Suspense 改进以及自动批处理机制，如何提升应用性能和用户体验。",
        content: "React 18 引入了许多激动人心的新特性...",
        category: "frontend",
        tags: ["React", "JavaScript", "Performance"],
        date: "2024-01-15",
        readTime: "8 min read",
        author: "Eric Wang"
    },
    {
        id: 2,
        title: "Go 微服务架构实践：从设计到部署",
        excerpt: "分享使用 Go 语言构建微服务架构的完整实践，包括服务发现、负载均衡、监控告警等关键技术。",
        content: "在现代软件开发中，微服务架构已经成为...",
        category: "backend",
        tags: ["Go", "Microservices", "Architecture"],
        date: "2024-01-12",
        readTime: "12 min read",
        author: "Eric Wang"
    },
    {
        id: 3,
        title: "Kubernetes 生产环境最佳实践",
        excerpt: "总结在生产环境中使用 Kubernetes 的最佳实践，包括资源管理、安全配置、监控和故障排除。",
        content: "Kubernetes 作为容器编排的事实标准...",
        category: "devops",
        tags: ["Kubernetes", "DevOps", "Production"],
        date: "2024-01-10",
        readTime: "10 min read",
        author: "Eric Wang"
    },
    {
        id: 4,
        title: "深度学习模型在前端的实际应用",
        excerpt: "探索如何在浏览器中运行深度学习模型，使用 TensorFlow.js 构建智能前端应用的实践经验。",
        content: "随着 WebAssembly 和 TensorFlow.js 的发展...",
        category: "ai",
        tags: ["TensorFlow.js", "Machine Learning", "Frontend"],
        date: "2024-01-08",
        readTime: "15 min read",
        author: "Eric Wang"
    },
    {
        id: 5,
        title: "Vue 3 Composition API 实战指南",
        excerpt: "详细介绍 Vue 3 Composition API 的使用方法，以及如何在大型项目中合理组织代码结构。",
        content: "Vue 3 的 Composition API 为我们提供了...",
        category: "frontend",
        tags: ["Vue", "Composition API", "JavaScript"],
        date: "2024-01-05",
        readTime: "6 min read",
        author: "Eric Wang"
    },
    {
        id: 6,
        title: "Docker 容器化应用的性能优化策略",
        excerpt: "分享 Docker 容器在生产环境中的性能优化经验，包括镜像优化、资源限制和监控策略。",
        content: "Docker 容器化技术在现代应用部署中...",
        category: "devops",
        tags: ["Docker", "Performance", "Optimization"],
        date: "2024-01-03",
        readTime: "9 min read",
        author: "Eric Wang"
    }
];

// Blog Management Class
class BlogManager {
    constructor() {
        this.posts = blogPosts;
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.postsPerPage = 6;
        this.currentPage = 1;
        this.init();
    }

    init() {
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
    const blogManager = new BlogManager();
    
    // Add ripple effects to buttons
    const buttons = document.querySelectorAll('.category-tab, .load-more-btn');
    buttons.forEach(addRippleEffect);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BlogManager, blogPosts };
} 