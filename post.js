// Post Detail Page JavaScript

class PostManager {
    constructor() {
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
            // 显示加载状态
            this.showLoading();
            
            // 从博客数据中查找文章
            const post = await this.getPostById(postId);
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

    async getPostById(postId) {
        // 这里应该从外部博客数据获取，暂时使用扩展的数据
        const posts = await this.getExtendedBlogPosts();
        return posts.find(post => post.id == postId);
    }

    async getExtendedBlogPosts() {
        // 确保blogPosts可用，如果没有则返回包含Seata文章的数组
        const basePosts = typeof blogPosts !== 'undefined' ? blogPosts : [];
        
        // 检查是否已经包含Seata文章，避免重复添加
        const hasSeataArticle = basePosts.some(post => post.id === 7);
        
        if (hasSeataArticle) {
            const posts = [];
            for (const post of basePosts) {
                if (post.id === 7) {
                    const content = await this.getSeataArticleContent();
                    posts.push({
                        ...post,
                        content: content
                    });
                } else {
                    posts.push(post);
                }
            }
            return posts;
        } else {
            const seataContent = await this.getSeataArticleContent();
            return [
                ...basePosts,
                {
                    id: 7,
                    title: "深入解析Seata TM模块：分布式事务管理器的设计与实现",
                    excerpt: "深入分析Seata框架中TM（Transaction Manager）模块的架构设计、核心实现和扩展机制，探讨分布式事务管理的最佳实践。",
                    content: seataContent,
                    category: "backend",
                    tags: ["Seata", "分布式事务", "微服务", "Java"],
                    date: "2024-01-20",
                    readTime: "25 min read",
                    author: "Eric Wang"
                }
            ];
        }
    }

    async renderPost(post) {
        try {
            // 隐藏加载动画
            const loadingElement = document.querySelector('.post-loading');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }

            // 更新页面标题
            document.title = `${post.title} - Eric Wang`;
            const titleElement = document.getElementById('post-title');
            if (titleElement) {
                titleElement.textContent = `${post.title} - Eric Wang`;
            }

            // 渲染文章内容
            const postContent = document.getElementById('post-content');
            if (!postContent) {
                console.error('Post content element not found');
                return;
            }

            // 检查文章内容
            if (!post.content || post.content.trim() === '') {
                console.warn('Post content is empty or undefined');
                postContent.innerHTML = '<div class="error-message"><p>文章内容为空或加载失败</p></div>';
                return;
            }

            // 转换Markdown内容
            console.log('Converting markdown to HTML...');
            const htmlContent = this.convertMarkdownToHtml(post.content);
            console.log('Converted HTML content length:', htmlContent.length);
            
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

            // 语法高亮和图表渲染
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
                    // 语法高亮
                    if (typeof hljs !== 'undefined') {
                        console.log('Applying syntax highlighting...');
                        hljs.highlightAll();
                    }
                    
                    // 初始化Mermaid图表
                    if (typeof mermaid !== 'undefined') {
                        console.log('Initializing Mermaid diagrams...');
                        
                        try {
                            // 简化的Mermaid配置
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
                            
                            // 手动渲染所有mermaid图表
                            const mermaidElements = document.querySelectorAll('.mermaid');
                            console.log(`Found ${mermaidElements.length} Mermaid diagrams`);
                            
                            if (mermaidElements.length > 0) {
                                for (let i = 0; i < mermaidElements.length; i++) {
                                    const element = mermaidElements[i];
                                    const originalCode = element.textContent.trim();
                                    const targetId = `mermaid-${i}`;
                                    
                                    console.log(`Processing Mermaid diagram ${i}:`, originalCode.substring(0, 50) + '...');
                                    
                                    try {
                                        element.innerHTML = `<div id="${targetId}" class="mermaid-container">正在渲染图表...</div>`;
                                        
                                        // 直接使用原始代码，不预处理
                                        const { svg } = await mermaid.render(`mermaid-graph-${i}`, originalCode);
                                        document.getElementById(targetId).innerHTML = svg;
                                        console.log(`✅ Successfully rendered Mermaid diagram ${i}`);
                                        
                                    } catch (mermaidError) {
                                        console.error(`❌ Error rendering Mermaid diagram ${i}:`, mermaidError.message);
                                        
                                        // 尝试使用预处理的代码
                                        try {
                                            const processedCode = this.preprocessMermaidCode(originalCode);
                                            const { svg } = await mermaid.render(`mermaid-graph-${i}-retry`, processedCode);
                                            document.getElementById(targetId).innerHTML = svg;
                                            console.log(`✅ Rendered Mermaid diagram ${i} after preprocessing`);
                                        } catch (retryError) {
                                            console.error(`❌ Retry failed for diagram ${i}:`, retryError.message);
                                            
                                            // 显示友好的错误信息
                                            element.innerHTML = `
                                                <div class="mermaid-error">
                                                    <div class="error-title">📊 图表渲染失败</div>
                                                    <div class="error-detail">
                                                        <p><strong>错误信息:</strong> ${mermaidError.message}</p>
                                                        <p>原始代码 (前200字符):</p>
                                                        <pre><code>${this.escapeHtml(originalCode.substring(0, 200))}${originalCode.length > 200 ? '...' : ''}</code></pre>
                                                    </div>
                                                </div>
                                            `;
                                        }
                                    }
                                }
                            }
                        } catch (initError) {
                            console.error('Mermaid initialization failed:', initError);
                        }
                    } else {
                        console.warn('Mermaid library not loaded');
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

        console.log('Converting markdown with marked.js, length:', markdown.length);
        
        try {
            // 预处理：保护Mermaid代码块，避免被highlight.js误处理
            const mermaidBlocks = [];
            let processedMarkdown = markdown;
            
            // 提取并保护所有mermaid代码块
            processedMarkdown = processedMarkdown.replace(/```mermaid\n([\s\S]*?)```/g, (match, code) => {
                const index = mermaidBlocks.length;
                mermaidBlocks.push(code.trim());
                return `<!--MERMAID_PLACEHOLDER_${index}-->`;
            });
            
            console.log(`Protected ${mermaidBlocks.length} Mermaid blocks`);
            
            // 配置marked.js选项
            if (typeof marked !== 'undefined') {
                // 配置marked渲染器
                const renderer = new marked.Renderer();
                
                // 自定义代码块渲染，特别处理mermaid
                renderer.code = function(code, language) {
                    if (language === 'mermaid') {
                        // 确保代码内容被正确保存，不进行HTML转义
                        return `<div class="mermaid">${code.trim()}</div>`;
                    }
                    
                    const langClass = language ? ` class="language-${language}"` : '';
                    return `<pre><code${langClass}>${code}</code></pre>`;
                };
                
                // 自定义链接渲染，添加target="_blank"
                renderer.link = function(href, title, text) {
                    const titleAttr = title ? ` title="${title}"` : '';
                    return `<a href="${href}"${titleAttr} target="_blank">${text}</a>`;
                };
                
                // 配置marked选项
                marked.setOptions({
                    renderer: renderer,
                    highlight: function(code, lang) {
                        // 跳过mermaid代码的语法高亮，避免被转换为CSS
                        if (lang === 'mermaid') {
                            return code; // 保持原始代码不变
                        }
                        
                        // 如果有highlight.js，使用它进行语法高亮
                        if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
                            try {
                                return hljs.highlight(code, { language: lang }).value;
                            } catch (err) {
                                console.warn('Highlight error:', err);
                            }
                        }
                        return code;
                    },
                    breaks: true,        // 支持换行符转换
                    gfm: true,          // 支持GitHub风格Markdown
                    tables: true,       // 支持表格
                    sanitize: false,    // 不清理HTML（我们用DOMPurify）
                    smartLists: true,   // 智能列表
                    smartypants: true   // 智能标点
                });
                
                // 使用marked转换（使用保护后的markdown）
                let html = marked.parse(processedMarkdown);
                console.log('Marked.js parsed HTML (first 500 chars):', html.substring(0, 500));
                
                // 恢复Mermaid代码块
                html = html.replace(/<!--MERMAID_PLACEHOLDER_(\d+)-->/g, (match, index) => {
                    const code = mermaidBlocks[parseInt(index)];
                    return `<div class="mermaid">${code}</div>`;
                });
                console.log(`Restored ${mermaidBlocks.length} Mermaid blocks`);
                
                // 检查是否包含mermaid图表
                const mermaidCount = (html.match(/<div class="mermaid">/g) || []).length;
                console.log(`Found ${mermaidCount} mermaid diagrams in parsed HTML`);
                
                // 使用DOMPurify清理HTML（如果可用）
                if (typeof DOMPurify !== 'undefined') {
                    html = DOMPurify.sanitize(html, {
                        ALLOWED_TAGS: [
                            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                            'p', 'br', 'div', 'span',
                            'ul', 'ol', 'li',
                            'strong', 'em', 'code', 'pre',
                            'a', 'img',
                            'blockquote', 'hr',
                            'table', 'thead', 'tbody', 'tr', 'th', 'td'
                        ],
                        ALLOWED_ATTR: [
                            'class', 'id', 'href', 'src', 'alt', 'title',
                            'target', 'rel', 'data-*'
                        ],
                        KEEP_CONTENT: true
                    });
                    
                    const mermaidCountAfter = (html.match(/<div class="mermaid">/g) || []).length;
                    console.log(`Mermaid diagrams after DOMPurify: ${mermaidCountAfter}`);
                }
                
                console.log('Marked.js conversion complete, HTML length:', html.length);
                return html;
                
            } else {
                // 如果marked.js不可用，回退到简单转换
                console.warn('Marked.js not available, using fallback converter');
                return this.fallbackMarkdownConverter(processedMarkdown, mermaidBlocks);
            }
            
        } catch (error) {
            console.error('Error converting markdown with marked.js:', error);
            // 如果出错，重新处理原始markdown
            const mermaidBlocks = [];
            let processedMarkdown = markdown;
            processedMarkdown = processedMarkdown.replace(/```mermaid\n([\s\S]*?)```/g, (match, code) => {
                const index = mermaidBlocks.length;
                mermaidBlocks.push(code.trim());
                return `<!--MERMAID_PLACEHOLDER_${index}-->`;
            });
            return this.fallbackMarkdownConverter(processedMarkdown, mermaidBlocks);
        }
    }

    fallbackMarkdownConverter(markdown, mermaidBlocks = []) {
        // 简化的fallback转换器
        let html = markdown;
        
        // 基本的Markdown转换
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
            // mermaid代码块已经被预处理过了，不应该在这里出现
            const langClass = language ? ` class="language-${language}"` : '';
            return `<pre><code${langClass}>${this.escapeHtml(code)}</code></pre>`;
        });
        
        // 恢复Mermaid代码块
        html = html.replace(/<!--MERMAID_PLACEHOLDER_(\d+)-->/g, (match, index) => {
            const code = mermaidBlocks[parseInt(index)];
            return `<div class="mermaid">${code}</div>`;
        });
        
        html = html.replace(/^#{3}\s+(.*)$/gm, '<h3>$1</h3>');
        html = html.replace(/^#{2}\s+(.*)$/gm, '<h2>$1</h2>');
        html = html.replace(/^#{1}\s+(.*)$/gm, '<h1>$1</h1>');
        html = html.replace(/^---+$/gm, '<hr>');
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // 处理段落
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

    preprocessMermaidCode(mermaidCode) {
        // 预处理Mermaid代码，修复常见的语法问题
        let processed = mermaidCode.trim();
        
        try {
            // 基本清理：移除多余的空行和空白字符
            processed = processed.replace(/\n\s*\n\s*\n/g, '\n\n');
            processed = processed.replace(/^\s+/gm, '    '); // 标准化缩进
            
            // 确保图表类型声明正确
            if (processed.match(/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|gantt|pie|journey)/)) {
                console.log('Valid Mermaid diagram type detected');
            } else {
                console.warn('Unknown Mermaid diagram type, proceeding with original code');
                return mermaidCode;
            }
            
            // 简单的语法修复，避免过度处理
            // 1. 标准化箭头间距
            processed = processed.replace(/\s*-->\s*/g, ' --> ');
            processed = processed.replace(/\s*--->\s*/g, ' ---> ');
            
            // 2. 移除可能导致问题的特殊字符（只处理明显的问题）
            processed = processed.replace(/[""]/g, '"');
            processed = processed.replace(/['']/g, "'");
            
            console.log('Preprocessed Mermaid code (first 100 chars):', processed.substring(0, 100));
            return processed;
            
        } catch (error) {
            console.warn('Error preprocessing Mermaid code:', error);
            return mermaidCode; // 返回原始代码
        }
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

        tocNav.appendChild(tocList);
    }

    async loadRelatedPosts(currentPost) {
        const allPosts = await this.getExtendedBlogPosts();
        console.log('All posts for related:', allPosts.length);
        
        const relatedPosts = allPosts
            .filter(post => 
                post.id !== currentPost.id && 
                (post.category === currentPost.category || 
                 post.tags.some(tag => currentPost.tags.includes(tag)))
            )
            .slice(0, 3);

        console.log('Related posts found:', relatedPosts.length);

        const relatedGrid = document.getElementById('related-grid');
        const relatedSection = document.getElementById('related-posts');
        
        if (relatedPosts.length === 0) {
            // 如果没有相关文章，显示最新的3篇文章（除当前文章外）
            const latestPosts = allPosts
                .filter(post => post.id !== currentPost.id)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3);
            
            if (latestPosts.length === 0) {
                relatedSection.style.display = 'none';
                return;
            }
            
            // 更新标题为"最新文章"
            const relatedTitle = document.querySelector('.related-title');
            if (relatedTitle) {
                relatedTitle.innerHTML = '<i class="fas fa-clock"></i> 最新文章';
            }
            
            relatedGrid.innerHTML = latestPosts.map(post => this.createRelatedCard(post)).join('');
        } else {
            relatedGrid.innerHTML = relatedPosts.map(post => this.createRelatedCard(post)).join('');
        }
        
        // 确保相关文章区域可见
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
        // 目录高亮跟随滚动
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
        }, {
            rootMargin: '-20% 0px -80% 0px'
        });

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
        // 加载完成后会在renderPost中替换内容，这里不需要额外操作
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

    async getSeataArticleContent() {
        try {
            console.log('Attempting to load Seata markdown file...');
            const response = await fetch('posts/seata-tm-module-complete-analysis.md');
            
            if (!response.ok) {
                console.warn(`Failed to load Seata markdown file: ${response.status} ${response.statusText}`);
                return this.getFallbackSeataContent();
            }
            
            const content = await response.text();
            console.log('Successfully loaded Seata article content, length:', content.length);
            
            if (!content || content.trim().length === 0) {
                console.warn('Loaded content is empty, using fallback');
                return this.getFallbackSeataContent();
            }
            
            return content;
            
        } catch (error) {
            console.error('Error loading Seata markdown file:', error);
            return this.getFallbackSeataContent();
        }
    }

    getFallbackSeataContent() {
        // 如果无法加载markdown文件，使用简化版本的内容
        return `# 深入解析Seata TM模块：分布式事务管理器的设计与实现

## 前言

在微服务架构中，分布式事务是一个绕不开的技术挑战。Seata作为阿里巴巴开源的分布式事务解决方案，通过TC、TM、RM三大组件协同工作，优雅地解决了跨服务的数据一致性问题。本文将深入分析Seata中的TM（Transaction Manager）模块，探讨其架构设计、核心实现和扩展机制。

## 什么是TM模块？

TM（Transaction Manager）是Seata框架中的事务管理器，负责全局事务的生命周期管理。它定义了全局事务的边界，协调各个分支事务的执行，并最终决定全局事务的提交或回滚。

### TM的核心职责

- **事务边界定义**：通过\`@GlobalTransactional\`注解标识全局事务范围
- **事务生命周期管理**：控制全局事务的开始、提交、回滚
- **与TC通信**：向事务协调器(TC)发送事务指令
- **事务传播控制**：处理嵌套事务和事务传播行为
- **异常处理**：根据业务异常决定事务的最终状态

## TM模块架构解析

### 核心组件结构

\`\`\`
tm/
├── TMClient.java                     # TM客户端初始化入口
├── DefaultTransactionManager.java    # TM核心实现，与TC通信
├── TransactionManagerHolder.java     # TM实例管理器（单例模式）
└── api/
    ├── GlobalTransaction.java            # 全局事务接口定义
    ├── DefaultGlobalTransaction.java     # 全局事务默认实现
    ├── GlobalTransactionContext.java    # 全局事务上下文管理
    ├── GlobalTransactionRole.java       # 事务角色枚举
    ├── TransactionalTemplate.java       # 事务模板类（核心执行逻辑）
    ├── TransactionalExecutor.java       # 业务执行器接口
    └── transaction/                      # 事务配置和扩展机制
        ├── TransactionInfo.java          # 事务配置信息
        ├── Propagation.java              # 事务传播行为
        ├── TransactionHook.java          # 事务生命周期Hook
        └── TransactionHookManager.java   # Hook管理器
\`\`\`

### 关键设计模式

TM模块巧妙运用了多种设计模式：

1. **代理模式（Proxy Pattern）**：通过AOP代理拦截\`@GlobalTransactional\`方法
2. **模板方法模式（Template Method）**：\`TransactionalTemplate\`定义事务处理流程
3. **策略模式（Strategy Pattern）**：支持多种事务传播行为
4. **单例模式（Singleton）**：\`TransactionManagerHolder\`确保TM实例唯一性
5. **观察者模式（Observer）**：通过Hook机制监听事务生命周期事件

## 核心实现深度剖析

### 1. 全局事务的生命周期

让我们通过源码分析一个完整的全局事务执行流程：

#### 事务开始阶段

\`\`\`java
// DefaultGlobalTransaction.java
@Override
public void begin(int timeout, String name) throws TransactionException {
    if (role != GlobalTransactionRole.Launcher) {
        assertXIDNotNull();
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("Ignore Begin(): just involved in global transaction [{}]", xid);
        }
        return;
    }
    
    assertXIDNull();
    String currentXid = RootContext.getXID();
    if (currentXid != null) {
        throw new IllegalStateException("Global transaction already exists," +
                " can't begin a new global transaction, currentXid = " + currentXid);
    }
    
    // 调用TM向TC发送开始事务请求
    xid = transactionManager.begin(null, null, name, timeout);
    status = GlobalStatus.Begin;
    RootContext.bind(xid);
    
    if (LOGGER.isInfoEnabled()) {
        LOGGER.info("Begin new global transaction [{}]", xid);
    }
}
\`\`\`

#### 事务提交阶段

\`\`\`java
// DefaultGlobalTransaction.java
@Override
public void commit() throws TransactionException {
    if (role == GlobalTransactionRole.Participant) {
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("Ignore Commit(): just involved in global transaction [{}]", xid);
        }
        return;
    }
    
    assertXIDNotNull();
    
    int retry = COMMIT_RETRY_COUNT;
    try {
        while (retry > 0) {
            try {
                // 向TC发送提交请求
                status = transactionManager.commit(xid);
                break;
            } catch (Throwable ex) {
                LOGGER.error("Failed to report global commit [{}],Retry Countdown: {}, reason: {}", 
                    this.xid, retry, ex.getMessage());
                retry--;
                if (retry == 0) {
                    throw new TransactionException("Failed to report global commit", ex);
                }
            }
        }
    } finally {
        if (xid.equals(RootContext.getXID())) {
            suspend();
        }
    }
    
    if (LOGGER.isInfoEnabled()) {
        LOGGER.info("[{}] commit status: {}", xid, status);
    }
}
\`\`\`

### 2. TransactionalTemplate：事务处理的核心模板

\`TransactionalTemplate\`是TM模块最核心的类，它实现了完整的分布式事务处理逻辑：

\`\`\`java
public Object execute(TransactionalExecutor business) throws Throwable {
    // 1. 获取事务信息
    TransactionInfo txInfo = business.getTransactionInfo();
    if (txInfo == null) {
        throw new ShouldNeverHappenException("transactionInfo does not exist");
    }
    
    // 2. 获取或创建全局事务
    GlobalTransaction tx = GlobalTransactionContext.getCurrentOrCreate();
    
    // 3. 计算事务传播行为
    Propagation propagation = txInfo.getPropagation();
    SuspendedResourcesHolder suspendedResourcesHolder = null;
    try {
        switch (propagation) {
            case NOT_SUPPORTED:
                suspendedResourcesHolder = tx.suspend();
                return business.execute();
            case REQUIRES_NEW:
                suspendedResourcesHolder = tx.suspend();
                break;
            case SUPPORTS:
                if (notExistingTransaction(tx)) {
                    return business.execute();
                }
                break;
            case REQUIRED:
                // 默认传播行为，继续执行
                break;
            default:
                throw new TransactionException("Not Supported Propagation:" + propagation);
        }
        
        // 4. 执行业务逻辑并处理事务
        try {
            beginTransaction(txInfo, tx);
            
            Object rs;
            try {
                // 执行业务方法
                rs = business.execute();
            } catch (Throwable ex) {
                // 发生异常，处理回滚逻辑
                completeTransactionAfterThrowing(txInfo, tx, ex);
                throw ex;
            }
            
            // 5. 提交事务
            commitTransaction(tx, txInfo);
            return rs;
            
        } finally {
            // 6. 清理资源
            triggerAfterCompletion(tx);
            cleanUp(tx);
        }
    } finally {
        // 恢复挂起的事务
        if (suspendedResourcesHolder != null) {
            tx.resume(suspendedResourcesHolder);
        }
    }
}
\`\`\`

### 3. 事务传播机制

Seata支持多种事务传播行为，与Spring事务保持一致：

\`\`\`java
public enum Propagation {
    REQUIRED(0),        // 当前有事务就加入，没有就创建新事务
    SUPPORTS(1),        // 当前有事务就加入，没有就以非事务方式执行
    MANDATORY(2),       // 当前必须有事务，没有就抛异常
    REQUIRES_NEW(3),    // 总是创建新事务，挂起当前事务
    NOT_SUPPORTED(4),   // 总是以非事务方式执行，挂起当前事务
    NEVER(5),          // 不能在事务中执行，有事务就抛异常
    NESTED(6);         // 嵌套事务（当前版本暂不支持）
}
\`\`\`

## Hook机制：优雅的扩展点设计

### TransactionHook接口设计

Seata提供了Hook机制，允许开发者在事务的关键节点插入自定义逻辑：

\`\`\`java
public interface TransactionHook {
    void beforeBegin();      // 事务开始前
    void afterBegin();       // 事务开始后
    void beforeCommit();     // 事务提交前
    void afterCommit();      // 事务提交后
    void beforeRollback();   // 事务回滚前
    void afterRollback();    // 事务回滚后
    void afterCompletion();  // 事务完成后（无论成功失败）
}
\`\`\`

### Hook管理机制

\`\`\`java
public final class TransactionHookManager {
    // 使用ThreadLocal确保线程安全
    private static final ThreadLocal<List<TransactionHook>> LOCAL_HOOKS = new ThreadLocal<>();
    
    public static void registerHook(TransactionHook transactionHook) {
        if (transactionHook == null) {
            throw new NullPointerException("transactionHook must not be null");
        }
        List<TransactionHook> transactionHooks = LOCAL_HOOKS.get();
        if (transactionHooks == null) {
            LOCAL_HOOKS.set(new ArrayList<>());
        }
        LOCAL_HOOKS.get().add(transactionHook);
    }
    
    public static void clear() {
        LOCAL_HOOKS.remove(); // 事务完成后自动清理
    }
}
\`\`\`

### Hook实际应用示例

\`\`\`java
// 示例1：事务性能监控Hook
public class TransactionPerformanceHook implements TransactionHook {
    private long startTime;
    
    @Override
    public void beforeBegin() {
        startTime = System.currentTimeMillis();
        MDC.put("txStartTime", String.valueOf(startTime));
    }
    
    @Override
    public void afterCompletion() {
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        
        // 记录事务执行时间
        TransactionMetrics.recordDuration(duration);
        
        if (duration > 5000) { // 超过5秒记录慢事务
            LOGGER.warn("Slow transaction detected, duration: {}ms", duration);
        }
        
        MDC.remove("txStartTime");
    }
}

// 示例2：事务审计Hook
public class TransactionAuditHook implements TransactionHook {
    @Override
    public void beforeBegin() {
        String userId = SecurityContext.getCurrentUserId();
        String operation = RootContext.getOperationName();
        
        AuditLogger.logTransactionStart(userId, operation);
    }
    
    @Override
    public void afterCommit() {
        AuditLogger.logTransactionSuccess();
    }
    
    @Override
    public void afterRollback() {
        AuditLogger.logTransactionRollback();
    }
}

// 使用方式
@GlobalTransactional
public void businessMethod() {
    // 注册Hook
    TransactionHookManager.registerHook(new TransactionPerformanceHook());
    TransactionHookManager.registerHook(new TransactionAuditHook());
    
    // 业务逻辑...
}
\`\`\`

## 与TC的通信机制

### DefaultTransactionManager实现

TM通过\`DefaultTransactionManager\`与TC进行通信：

\`\`\`java
public class DefaultTransactionManager implements TransactionManager {
    
    @Override
    public String begin(String applicationId, String transactionServiceGroup, 
                       String name, int timeout) throws TransactionException {
        GlobalBeginRequest request = new GlobalBeginRequest();
        request.setTransactionName(name);
        request.setTimeout(timeout);
        
        GlobalBeginResponse response = (GlobalBeginResponse) syncCall(request);
        if (response.getResultCode() == ResultCode.Failed) {
            throw new TmTransactionException(TransactionExceptionCode.BeginFailed, 
                response.getMsg());
        }
        return response.getXid();
    }
    
    @Override
    public GlobalStatus commit(String xid) throws TransactionException {
        GlobalCommitRequest request = new GlobalCommitRequest();
        request.setXid(xid);
        
        GlobalCommitResponse response = (GlobalCommitResponse) syncCall(request);
        return response.getGlobalStatus();
    }
    
    @Override
    public GlobalStatus rollback(String xid) throws TransactionException {
        GlobalRollbackRequest request = new GlobalRollbackRequest();
        request.setXid(xid);
        
        GlobalRollbackResponse response = (GlobalRollbackResponse) syncCall(request);
        return response.getGlobalStatus();
    }
}
\`\`\`

## 最佳实践与注意事项

### 1. 正确使用@GlobalTransactional注解

\`\`\`java
// ✅ 正确用法：在业务入口方法上使用
@GlobalTransactional(name = "createOrder", rollbackFor = Exception.class)
public void createOrder(OrderRequest request) {
    // 调用多个服务
    orderService.createOrder(request);
    inventoryService.reduceStock(request.getProductId(), request.getQuantity());
    accountService.deductBalance(request.getUserId(), request.getAmount());
}

// ❌ 错误用法：不要在每个服务方法上都添加
@GlobalTransactional  // 不必要的注解
public void createOrder(OrderRequest request) {
    // 业务逻辑
}
\`\`\`

### 2. 合理使用事务传播行为

\`\`\`java
// 场景1：记录审计日志，不影响主业务事务
@GlobalTransactional(propagation = Propagation.REQUIRES_NEW)
public void auditLog(String operation) {
    // 独立事务，即使失败也不影响主业务
}

// 场景2：查询操作，支持事务但不强制
@GlobalTransactional(propagation = Propagation.SUPPORTS)
public List<Order> queryOrders(String userId) {
    // 如果在事务中就加入，否则非事务执行
    return orderMapper.selectByUserId(userId);
}
\`\`\`

### 3. 异常处理和回滚规则

\`\`\`java
@GlobalTransactional(
    rollbackFor = {BusinessException.class, RuntimeException.class},
    noRollbackFor = {ValidationException.class}
)
public void processOrder(OrderRequest request) {
    try {
        validateOrder(request); // ValidationException不会触发回滚
        processPayment(request); // BusinessException会触发回滚
    } catch (ValidationException e) {
        // 处理验证异常，事务继续
        throw new ServiceException("Invalid order data", e);
    }
}
\`\`\`

## 实际应用场景分析

### 场景1：电商订单处理

\`\`\`java
@Service
public class OrderService {
    
    @GlobalTransactional(name = "createOrder", rollbackFor = Exception.class)
    public OrderResult createOrder(CreateOrderRequest request) {
        // 注册监控Hook
        TransactionHookManager.registerHook(new OrderPerformanceHook(request.getOrderId()));
        
        try {
            // 1. 创建订单
            Order order = orderRepository.createOrder(request);
            
            // 2. 扣减库存
            inventoryService.reduceStock(request.getItems());
            
            // 3. 扣减余额
            accountService.deductBalance(request.getUserId(), order.getTotalAmount());
            
            // 4. 发送通知（使用REQUIRES_NEW保证独立性）
            notificationService.sendOrderCreatedNotification(order);
            
            return OrderResult.success(order);
            
        } catch (InsufficientStockException e) {
            // 库存不足，记录但不回滚整个事务
            auditService.logStockShortage(request);
            throw e;
        } catch (InsufficientBalanceException e) {
            // 余额不足，回滚事务
            throw e;
        }
    }
}
\`\`\`

## 总结

Seata的TM模块通过精心设计的架构和巧妙的实现，为开发者提供了简洁而强大的分布式事务管理能力。其主要特点包括：

1. **声明式事务管理**：通过注解简化分布式事务的使用
2. **灵活的传播机制**：支持多种事务传播行为
3. **优雅的扩展点**：Hook机制提供了强大的扩展能力
4. **完善的异常处理**：支持细粒度的回滚控制
5. **高性能设计**：通过合理的架构设计保证性能

理解TM模块的设计思想和实现细节，不仅有助于更好地使用Seata，也为我们设计分布式系统提供了宝贵的经验。在实际应用中，合理使用事务边界、正确配置传播行为、恰当利用Hook机制，能够帮助我们构建更加稳定和高效的微服务应用。

---

*本文基于Seata最新版本分析，详细源码可参考[Apache Seata](https://github.com/apache/incubator-seata)官方仓库。*`;
    }
}

// 为错误样式添加CSS
const errorStyle = document.createElement('style');
errorStyle.textContent = `
    .error-message {
        text-align: center;
        padding: 4rem 2rem;
    }
    
    .error-terminal {
        max-width: 500px;
        margin: 0 auto;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid var(--accent-pink);
        border-radius: 8px;
        overflow: hidden;
    }
    
    .error-line {
        padding: 0.75rem 1rem;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
    }
    
    .error-prompt {
        color: var(--accent-pink);
        margin-right: 1rem;
        font-weight: 600;
    }
    
    .error-text {
        color: var(--text-secondary);
    }
    
    .error-text a {
        color: var(--accent-green);
        text-decoration: none;
    }
    
    .error-text a:hover {
        text-decoration: underline;
    }
`;
document.head.appendChild(errorStyle);

// 初始化文章管理器
document.addEventListener('DOMContentLoaded', () => {
    new PostManager();
});

// 导出供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PostManager;
} 