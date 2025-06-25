# WangzJi.github.io

Eric Wang 的个人网站 - 一个具有赛博朋克风格的现代化开发者作品集和技术博客。

## ✨ 特性

### 🎨 视觉设计
- **赛博朋克主题**：深色背景配以霓虹绿、粉色和青色的配色方案
- **矩阵雨效果**：动态的Matrix风格背景动画
- **几何动画**：浮动的几何形状和粒子效果
- **终端界面**：仿终端的交互式元素设计
- **霓虹发光**：文本和按钮的霓虹发光效果

### 🔧 技术特性
- **响应式设计**：适配桌面、平板和移动设备
- **流畅动画**：CSS3 和 JavaScript 驱动的交互动画
- **现代化导航**：固定导航栏，支持平滑滚动
- **代码展示**：3D代码预览和语法高亮
- **性能优化**：延迟加载和动画性能优化

### 📝 博客功能
- **技术博客**：分享前端、后端、DevOps、AI/ML等技术文章
- **分类筛选**：按技术栈分类浏览文章
- **搜索功能**：终端风格的文章搜索
- **文章详情**：支持Markdown渲染、代码高亮、目录导航
- **相关推荐**：基于标签和分类的相关文章推荐

## 📁 项目结构

```
wangzji.github.io/
├── index.html              # 主页
├── blog.html              # 博客列表页
├── post.html              # 文章详情页
├── styles.css             # 主样式文件
├── blog.css               # 博客专用样式
├── post.css               # 文章页面样式
├── script.js              # 主交互脚本
├── blog.js                # 博客功能脚本
├── post.js                # 文章页面脚本
├── posts/                 # 博客文章目录
│   └── seata-tm-module-complete-analysis.md
├── README.md              # 项目说明
└── LICENSE                # 开源协议
```

## 🛠️ 技术栈

### 前端技术
- **HTML5**: 语义化标签和现代Web标准
- **CSS3**: 
  - CSS Grid 和 Flexbox 布局
  - CSS 变量和自定义属性
  - 动画和过渡效果
  - 响应式媒体查询
- **JavaScript (ES6+)**:
  - 模块化编程
  - 异步编程 (Promise/async-await)
  - DOM 操作和事件处理
  - Canvas API (Matrix雨效果)
  - Intersection Observer API

### 设计和动效
- **Canvas API**: Matrix雨动画效果
- **CSS Animations**: 关键帧动画和过渡
- **Intersection Observer**: 滚动触发动画
- **Font Awesome**: 图标库
- **Google Fonts**: JetBrains Mono 和 Inter 字体

### 博客系统
- **Markdown 支持**: 简化的Markdown到HTML转换
- **语法高亮**: highlight.js 代码高亮
- **搜索功能**: 前端JavaScript实现的文章搜索
- **分类系统**: 多标签和分类管理

## 🚀 快速开始

### 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/WangzJi/wangzji.github.io.git
   cd wangzji.github.io
   ```

2. **启动本地服务器**
   ```bash
   # 使用 Python 3
   python -m http.server 8000
   
   # 或使用 Python 2
   python -m SimpleHTTPServer 8000
   
   # 或使用 Node.js
   npx serve .
   
   # 或使用 PHP
   php -S localhost:8000
   ```

3. **访问网站**
   打开浏览器访问 `http://localhost:8000`

### GitHub Pages 部署

1. **推送到GitHub**
   ```bash
   git add .
   git commit -m "Add new blog post"
   git push origin main
   ```

2. **配置GitHub Pages**
   - 进入仓库设置页面
   - 在 Pages 选项中选择 main 分支
   - 网站将自动部署到 `https://wangzji.github.io`

## 📝 添加博客文章

### 方法一：直接编辑数据文件

在 `blog.js` 和 `post.js` 中的 `blogPosts` 数组添加新文章：

```javascript
{
    id: 8, // 确保ID唯一
    title: "你的文章标题",
    excerpt: "文章摘要，简要描述文章内容...",
    content: "完整的文章内容，支持Markdown语法",
    category: "backend", // frontend, backend, devops, ai
    tags: ["标签1", "标签2", "标签3"],
    date: "2024-01-21", // YYYY-MM-DD 格式
    readTime: "10 min read",
    author: "Eric Wang"
}
```

### 方法二：创建独立的Markdown文件

1. 在 `posts/` 目录下创建新的 `.md` 文件
2. 按照现有文章的格式编写内容
3. 更新 `post.js` 中的文章加载逻辑

## 🎨 自定义样式

### 颜色主题

在 `styles.css` 中定义了CSS变量，可以轻松自定义颜色：

```css
:root {
    --bg-color: #0a0a0a;
    --text-color: #e0e0e0;
    --text-secondary: #a0a0a0;
    --accent-green: #00ff88;
    --accent-pink: #ff0080;
    --accent-cyan: #00d4ff;
    --border-color: #333;
}
```

### 动画效果

- **Matrix雨**: 在 `script.js` 中的 `MatrixRain` 类
- **粒子效果**: CSS动画定义的浮动粒子
- **霓虹发光**: `text-shadow` 和 `box-shadow` 效果
- **悬停动画**: `:hover` 伪类和 `transition` 属性

## 📱 响应式设计

网站采用移动优先的响应式设计：

- **桌面端** (>1024px): 完整的多列布局和动画效果
- **平板端** (768px-1024px): 调整布局和字体大小
- **移动端** (<768px): 单列布局，优化触摸操作

## 🔧 功能扩展

### 添加新的技术分类

1. 在 `blog.html` 中添加新的分类标签
2. 更新 `blog.js` 和 `post.js` 中的 `getCategoryName` 方法
3. 在 `blog.css` 中添加对应的样式

### 集成评论系统

推荐的评论系统：
- **Disqus**: 功能丰富的第三方评论系统
- **GitTalk**: 基于GitHub Issues的评论系统
- **Utterances**: 轻量级的GitHub评论组件

### SEO优化

- 添加 meta 标签和 Open Graph 标签
- 实现结构化数据 (JSON-LD)
- 优化页面加载速度
- 添加 sitemap.xml

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

### 贡献指南

1. Fork 这个仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📧 联系方式

- **Email**: iwongjian666@gmail.com
- **GitHub**: [@WangzJi](https://github.com/WangzJi)
- **Website**: [wangzji.github.io](https://wangzji.github.io)

---

⭐ 如果这个项目对你有帮助，欢迎给个星标！
