# Eric Wang - 开发者作品集

<div align="center">
  <h2>🚀 赛博朋克开发者作品集 🚀</h2>
  <p>一个具有矩阵雨效果和赛博朋克美学的未来感交互式个人网站</p>
  
  <p>
    <a href="README.md">English</a> | 
    <a href="README-zh.md">中文</a>
  </p>
  
  [![网站](https://img.shields.io/badge/网站-在线-00ff88?style=for-the-badge)](https://wangzji.github.io)
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/zh-CN/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
</div>

## 🌟 功能特色

- **🔥 矩阵雨背景** - 动态下落字符效果
- **⚡ 粒子系统** - 跟随鼠标的交互粒子  
- **🌈 全息效果** - 赛博朋克风格的视觉覆盖层
- **💻 3D终端模拟** - 带打字机效果的动画终端
- **📊 数据可视化** - 实时动画图表和图形
- **🎯 波纹效果** - 点击交互反馈
- **📱 完全响应式** - 针对所有设备优化
- **🚀 性能优化** - 自动性能监控

## 🛠️ 技术栈

```javascript
const developer = {
  name: 'Eric Wang',
  skills: ['React', 'Java', 'Go'],
  passion: '创造魔法',
  experience: '10+ 年',
  projects: '25+',
  code() {
    return '令人惊艳的项目';
  }
};
```

### 使用技术
- **前端**: HTML5, CSS3, 原生JavaScript
- **设计**: 赛博朋克/矩阵美学
- **效果**: Canvas动画, CSS变换
- **字体**: JetBrains Mono, Inter
- **图标**: Font Awesome 6

## 📂 项目结构

```
wangzji.github.io/
├── index.html      # 主HTML结构
├── styles.css      # 赛博朋克样式和动画
├── script.js       # 交互效果和矩阵雨
├── README.md       # 英文项目文档
├── README-zh.md    # 中文项目文档
└── LICENSE         # MIT许可证
```

## 🚀 快速开始

### 本地开发
```bash
# 克隆仓库
git clone https://github.com/WangzJi/wangzji.github.io.git
cd wangzji.github.io

# 启动本地服务器
python -m http.server 8000
# 或者
npx serve

# 打开浏览器
open http://localhost:8000
```

### GitHub Pages 部署
1. Fork 这个仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 `main` 分支作为源
4. 访问 `https://yourusername.github.io`

## 🎨 自定义配置

### 个人信息
在 `index.html` 中更新你的详细信息：
```html
<!-- 终端输出 -->
<div class="output-line">
  <span class="output-prompt">></span> 你的姓名
</div>
<div class="output-line">
  <span class="output-prompt">></span> 你的职位
</div>

<!-- 联系信息 -->
<a href="mailto:your.email@example.com">your.email@example.com</a>
```

### 颜色方案
在 `styles.css` 中修改CSS变量：
```css
:root {
  --primary-color: #00ff88;    /* 矩阵绿 */
  --secondary-color: #ff0080;  /* 霓虹粉 */
  --accent-color: #00d4ff;     /* 赛博蓝 */
  --bg-primary: #0a0a0a;       /* 深黑色 */
}
```

## 🔧 高级功能

### 矩阵雨配置
在 `script.js` 中自定义矩阵效果：
```javascript
class MatrixRain {
  constructor() {
    this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    this.fontSize = 14;
    // 根据需要自定义
  }
}
```

### 性能选项
网站会自动为低性能设备优化：
- FPS < 30 时禁用粒子效果
- 降低动画复杂度
- 隐藏非必要视觉元素

## 📱 响应式设计

| 设备 | 断点 | 优化措施 |
|------|------|----------|
| 手机 | `< 768px` | 简化布局，减少效果 |
| 平板 | `768px - 1024px` | 优化网格，触摸友好 |
| 桌面 | `> 1024px` | 完整效果，增强动画 |

## 🎯 浏览器支持

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📈 性能表现

- 🚀 **Lighthouse 评分**: 95+ 
- ⚡ **首次绘制**: < 1秒
- 🎯 **可交互**: < 2秒
- 📱 **移动端优化**: 自适应效果

## 🤖 交互元素

### 终端模拟
- 实时打字机效果
- 多种命令循环
- 真实终端样式

### 代码预览
- 3D透视变换
- 语法高亮
- 可执行动画

### UI元素
- 浮动状态指示器
- 进度条
- 数据可视化

## 🎮 彩蛋功能

- 点击任何地方产生波纹效果
- 鼠标移动创建粒子轨迹
- 终端命令循环显示真实开发者命令
- 隐藏的性能监控器

## 📧 联系方式

- **邮箱**: iwongjian666@gmail.com
- **GitHub**: [@WangzJi](https://github.com/WangzJi)
- **网站**: [wangzji.github.io](https://wangzji.github.io)

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🌟 致谢

由 Eric Wang 用 💚 创造

灵感来源于赛博朋克美学和《黑客帝国》

---

<div align="center">
  <sub>用创造数字体验的热情构建</sub>
</div>

## 🔄 版本说明

### v1.0.0 (当前版本)
- ✅ 矩阵雨背景动画
- ✅ 交互式粒子系统
- ✅ 3D终端模拟
- ✅ 浮动UI元素
- ✅ 数据可视化
- ✅ 响应式设计
- ✅ 性能监控

### 🚧 计划功能
- 🔮 主题切换器
- 🌐 多语言支持
- 📝 博客集成
- 🖼️ 项目截图
- 📊 GitHub API集成
- 💌 联系表单

## 🛠️ 开发指南

### 代码风格
```javascript
// 使用现代ES6+语法
const initFeature = () => {
  // 功能实现
};

// CSS变量命名
:root {
  --feature-color: #value;
}
```

### 贡献指南
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📚 学习资源

- [CSS动画指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations)
- [Canvas教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)
- [现代JavaScript](https://zh.javascript.info/)
- [响应式设计](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

> 💡 **提示**: 如果你喜欢这个项目，别忘了给它一个⭐️! 