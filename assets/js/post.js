// Post Detail Page JavaScript

class PostManager {
    constructor(dataService) {
        this.dataService = dataService;
        this.currentPostId = null;
        this.init();
    }

    init() {
        this.currentPostId = this.getPostIdFromUrl();
        if (this.currentPostId) {
            this.loadPost(this.currentPostId);
        } else {
            this.showError('文章ID不存在');
        }
    }

    getPostIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async loadPost(postId) {
        try {
            this.showLoading();
            const post = await this.dataService.getPostById(postId);
            if (post) {
                await this.renderPost(post);
                this.generateTableOfContents();
                await this.loadRelatedPosts(post);
                this.initScrollEffects();
            } else {
                this.showError('文章不存在');
            }
        } catch (error) {
            console.error('加载文章失败:', error);
            this.showError('文章加载失败，请稍后重试');
        } finally {
            this.hideLoading();
        }
    }

    async renderPost(post) {
        try {
            const loadingElement = document.querySelector('.post-loading');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }

            document.title = `${post.title} - Eric Wang`;
            const titleElement = document.getElementById('post-title');
            if (titleElement) {
                titleElement.textContent = `${post.title} - Eric Wang`;
            }

            const postContent = document.getElementById('post-content');
            if (!postContent) {
                console.error('Post content element not found');
                return;
            }

            if (!post.content || post.content.trim() === '') {
                console.warn('Post content is empty or undefined');
                postContent.innerHTML = '<div class="error-message"><p>文章内容为空或加载失败</p></div>';
                return;
            }

            const htmlContent = this.convertMarkdownToHtml(post.content);

            if (!htmlContent || htmlContent.trim() === '') {
                console.error('HTML conversion failed');
                postContent.innerHTML = '<div class="error-message"><p>文章内容转换失败</p></div>';
                return;
            }

            postContent.innerHTML = `
                <div class="post-header">
                    <h1 class="post-title-main">${post.title}</h1>
                    <div class="post-meta-main">
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${this.formatDate(post.date)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${post.readTime}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-user"></i>
                            <span>${post.author}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-folder"></i>
                            <span>${this.getCategoryName(post.category)}</span>
                        </div>
                    </div>
                    <div class="post-excerpt-main">
                        ${post.excerpt}
                    </div>
                    <div class="post-tags-main">
                        ${post.tags.map(tag => `<span class="tag-main">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="post-content-main">
                    ${htmlContent}
                </div>
            `;

            await this.initializeContentFeatures();

        } catch (error) {
            console.error('Error rendering post:', error);
            const postContent = document.getElementById('post-content');
            if (postContent) {
                postContent.innerHTML = `
                    <div class="error-message">
                        <p>渲染文章时出错: ${error.message}</p>
                        <pre>${this.escapeHtml(JSON.stringify(post, null, 2).substring(0, 500))}...</pre>
                    </div>
                `;
            }
        }
    }

    async initializeContentFeatures() {
        return new Promise((resolve) => {
            setTimeout(async () => {
                try {
                    if (typeof hljs !== 'undefined') {
                        hljs.highlightAll();
                    }
                    if (typeof mermaid !== 'undefined') {
                        mermaid.initialize({
                            theme: 'dark',
                            themeVariables: {
                                primaryColor: '#00ff88',
                                primaryTextColor: '#ffffff',
                                primaryBorderColor: '#00ff88',
                                lineColor: '#00d4ff',
                                secondaryColor: '#ff0080',
                                background: '#0a0a0a'
                            },
                            securityLevel: 'loose',
                            startOnLoad: false
                        });
                        const mermaidElements = document.querySelectorAll('.mermaid');
                        if (mermaidElements.length > 0) {
                            for (let i = 0; i < mermaidElements.length; i++) {
                                const element = mermaidElements[i];
                                const originalCode = element.textContent.trim();
                                const targetId = `mermaid-${i}`;
                                try {
                                    element.innerHTML = `<div id="${targetId}" class="mermaid-container"></div>`;
                                    const { svg } = await mermaid.render(`mermaid-graph-${i}`, originalCode);
                                    document.getElementById(targetId).innerHTML = svg;
                                } catch (mermaidError) {
                                    console.error(`Error rendering Mermaid diagram ${i}:`, mermaidError.message);
                                    element.innerHTML = `
                                        <div class="mermaid-error">
                                            <div class="error-title">📊 图表渲染失败</div>
                                            <div class="error-detail">
                                                <p><strong>错误信息:</strong> ${mermaidError.message}</p>
                                                <pre><code>${this.escapeHtml(originalCode.substring(0, 200))}${originalCode.length > 200 ? '...' : ''}</code></pre>
                                            </div>
                                        </div>
                                    `;
                                }
                            }
                        }
                    }
                    resolve();
                } catch (error) {
                    console.error('Error in initializeContentFeatures:', error);
                    resolve();
                }
            }, 100);
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

    convertMarkdownToHtml(markdown) {
        if (!markdown || markdown.trim() === '') {
            return '<p>内容加载中...</p>';
        }
        try {
            const mermaidBlocks = [];
            let processedMarkdown = markdown.replace(/```mermaid\n([\s\S]*?)```/g, (match, code) => {
                const index = mermaidBlocks.length;
                mermaidBlocks.push(code.trim());
                return `<!--MERMAID_PLACEHOLDER_${index}-->`;
            });

            if (typeof marked !== 'undefined') {
                const renderer = new marked.Renderer();
                renderer.code = function(code, language) {
                    if (language === 'mermaid') {
                        return `<div class="mermaid">${code.trim()}</div>`;
                    }
                    const langClass = language ? ` class="language-${language}"` : '';
                    return `<pre><code${langClass}>${code}</code></pre>`;
                };
                renderer.link = function(href, title, text) {
                    const titleAttr = title ? ` title="${title}"` : '';
                    return `<a href="${href}"${titleAttr} target="_blank">${text}</a>`;
                };
                marked.setOptions({
                    renderer: renderer,
                    highlight: function(code, lang) {
                        if (lang === 'mermaid') {
                            return code;
                        }
                        if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
                            try {
                                return hljs.highlight(code, { language: lang }).value;
                            } catch (err) {
                                console.warn('Highlight error:', err);
                            }
                        }
                        return code;
                    },
                    breaks: true,
                    gfm: true,
                    tables: true,
                    sanitize: false,
                    smartLists: true,
                    smartypants: true
                });
                let html = marked.parse(processedMarkdown);
                html = html.replace(/<!--MERMAID_PLACEHOLDER_(\d+)-->/g, (match, index) => {
                    const code = mermaidBlocks[parseInt(index)];
                    return `<div class="mermaid">${code}</div>`;
                });
                if (typeof DOMPurify !== 'undefined') {
                    html = DOMPurify.sanitize(html, {
                        ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'div', 'span', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'pre', 'a', 'img', 'blockquote', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
                        ALLOWED_ATTR: ['class', 'id', 'href', 'src', 'alt', 'title', 'target', 'rel', 'data-*'],
                        KEEP_CONTENT: true
                    });
                }
                return html;
            } else {
                return this.fallbackMarkdownConverter(processedMarkdown, mermaidBlocks);
            }
        } catch (error) {
            console.error('Error converting markdown:', error);
            return `<p>Error converting markdown: ${error.message}</p>`;
        }
    }

    fallbackMarkdownConverter(markdown, mermaidBlocks = []) {
        let html = markdown;
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
            const langClass = language ? ` class="language-${language}"` : '';
            return `<pre><code${langClass}>${this.escapeHtml(code)}</code></pre>`;
        });
        html = html.replace(/<!--MERMAID_PLACEHOLDER_(\d+)-->/g, (match, index) => {
            const code = mermaidBlocks[parseInt(index)];
            return `<div class="mermaid">${code}</div>`;
        });
        html = html.replace(/^#{3}\s+(.*)$/gm, '<h3>$1</h3>').replace(/^#{2}\s+(.*)$/gm, '<h2>$1</h2>').replace(/^#{1}\s+(.*)$/gm, '<h1>$1</h1>');
        html = html.replace(/^---+$/gm, '<hr>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        const paragraphs = html.split(/\n\s*\n/);
        html = paragraphs.map(p => {
            p = p.trim();
            if (!p) return '';
            if (p.match(/^<(h[1-6]|ul|ol|li|pre|blockquote|div|hr)/i)) return p;
            return `<p>${p}</p>`;
        }).filter(Boolean).join('\n\n');
        return html;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    generateTableOfContents() {
        const headers = document.querySelectorAll('.post-content-main h1, .post-content-main h2, .post-content-main h3');
        const tocNav = document.getElementById('toc-nav');
        if (headers.length === 0 || !tocNav) {
            const tocElement = document.getElementById('toc');
            if (tocElement) {
                tocElement.style.display = 'none';
            }
            return;
        }
        const tocList = document.createElement('ul');
        headers.forEach((header, index) => {
            const level = parseInt(header.tagName.substr(1));
            const id = `heading-${index}`;
            header.id = id;
            const li = document.createElement('li');
            li.className = `toc-level-${level}`;
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = header.textContent;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                header.scrollIntoView({ behavior: 'smooth' });
            });
            li.appendChild(link);
            tocList.appendChild(li);
        });
        tocNav.innerHTML = ''; // Clear previous TOC
        tocNav.appendChild(tocList);
    }

    async loadRelatedPosts(currentPost) {
        const relatedPosts = await this.dataService.getRelatedPosts(currentPost);
        const relatedGrid = document.getElementById('related-grid');
        const relatedSection = document.getElementById('related-posts');
        if (relatedPosts.length === 0) {
            relatedSection.style.display = 'none';
            return;
        }
        relatedGrid.innerHTML = relatedPosts.map(post => this.createRelatedCard(post)).join('');
        relatedSection.style.display = 'block';
    }

    createRelatedCard(post) {
        return `
            <div class="related-card" onclick="window.location.href='post.html?id=${post.id}'">
                <div class="related-content">
                    <h4 class="related-title-text">${post.title}</h4>
                    <p class="related-excerpt">${post.excerpt}</p>
                </div>
                <div class="related-meta">
                    <span class="related-date">
                        <i class="fas fa-calendar-alt"></i> ${this.formatDate(post.date)}
                    </span>
                    <span class="related-read-time">
                        <i class="fas fa-clock"></i> ${post.readTime}
                    </span>
                </div>
            </div>
        `;
    }

    initScrollEffects() {
        const headers = document.querySelectorAll('.post-content-main h1, .post-content-main h2, .post-content-main h3');
        const tocLinks = document.querySelectorAll('.toc-nav a');
        if (headers.length === 0 || tocLinks.length === 0) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    tocLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.toc-nav a[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, { rootMargin: '-20% 0px -80% 0px' });
        headers.forEach(header => observer.observe(header));
    }

    showLoading() {
        const loadingHtml = `
            <div class="loading-container">
                <div class="loading-spinner">
                    <div class="spinner"></div>
                </div>
                <p class="loading-text">正在加载文章...</p>
            </div>
        `;
        const postContent = document.getElementById('post-content');
        if (postContent) {
            postContent.innerHTML = loadingHtml;
        }
    }

    hideLoading() {
        // Content is replaced in renderPost, so this can be empty
    }

    showError(message) {
        const postContent = document.getElementById('post-content');
        postContent.innerHTML = `
            <div class="error-message">
                <div class="error-terminal">
                    <div class="terminal-header">
                        <div class="terminal-buttons">
                            <span class="btn-close"></span>
                            <span class="btn-minimize"></span>
                            <span class="btn-maximize"></span>
                        </div>
                        <div class="terminal-title">error.log</div>
                    </div>
                    <div class="terminal-body">
                        <div class="error-line">
                            <span class="error-prompt">ERROR:</span>
                            <span class="error-text">${message}</span>
                        </div>
                        <div class="error-line">
                            <span class="error-prompt">SOLUTION:</span>
                            <span class="error-text">请返回 <a href="blog.html">博客列表</a> 选择其他文章</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    }

const errorStyle = document.createElement('style');
errorStyle.textContent = `
    .error-message { text-align: center; padding: 4rem 2rem; }
    .error-terminal { max-width: 500px; margin: 0 auto; background: rgba(0, 0, 0, 0.9); border: 1px solid var(--accent-pink); border-radius: 8px; overflow: hidden; }
    .error-line { padding: 0.75rem 1rem; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; }
    .error-prompt { color: var(--accent-pink); margin-right: 1rem; font-weight: 600; }
    .error-text { color: var(--text-secondary); }
    .error-text a { color: var(--accent-green); text-decoration: none; }
    .error-text a:hover { text-decoration: underline; }
`;
document.head.appendChild(errorStyle);

document.addEventListener('DOMContentLoaded', () => {
    new PostManager(dataService);
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PostManager;
}