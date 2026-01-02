# 博客排版自动配置指南

本指南说明如何使用自动排版系统让你的博客文章自动变好看。

---

## 已完成的配置

### ✅ 第一阶段：Tailwind Typography 插件

已安装并配置 `@tailwindcss/typography` 插件。

**修改的文件：**
- `tailwind.config.js` - 添加了 Typography 插件和扩展的内容路径
- `_includes/layouts/blog-post.njk` - 使用 `prose prose-lg prose-invert max-w-none` 类

**效果：**
- Markdown 内容自动获得统一的排版样式
- 标题、段落、列表、表格、引用、代码块等自动美化
- 暗色模式优化（`prose-invert`）

---

### ✅ 第二阶段：VSCode 自动格式化

已配置 VSCode 自动格式化 Markdown 文件。

**创建的文件：**
- `.vscode/settings.json` - VSCode 设置（保存时自动格式化）
- `.vscode/extensions.json` - 推荐的扩展列表
- `.prettierrc.json` - Prettier 格式化配置

**需要安装的扩展：**
1. **Markdown All in One** (`yzhang.markdown-all-in-one`)
   - 提供 Markdown 写作增强功能（目录、表格等）

2. **markdownlint** (`DavidAnson.vscode-markdownlint`)
   - 自动检查 Markdown 格式问题
   - 保存时自动修复

3. **Prettier** (`esbenp.prettier-vscode`)
   - 保存时自动格式化 Markdown 和代码

**安装方法：**
在 VSCode 中打开扩展面板（`Ctrl+Shift+X` 或 `Cmd+Shift+X`），搜索并安装上述扩展。

---

### ✅ 第三阶段：自动 Git 提交/推送

已创建配置指南文档 `docs/AUTO_GIT_SETUP.md`，包含三种方案：

1. **Auto Git Commit and Push**（最简单）
2. **Run on Save**（更灵活）
3. **手动脚本**（最安全）

---

## 如何使用

### 写作流程

1. **创建新文章**
   - 在 `blog/posts/` 目录下创建新的 `.md` 文件
   - 使用 Front Matter 添加元数据（标题、日期、分类等）

2. **编写内容**
   - 直接编写普通 Markdown
   - 无需手动添加任何 CSS 类
   - 排版会自动应用

3. **保存文件**
   - VSCode 会自动格式化 Markdown
   - markdownlint 会自动修复格式问题

4. **预览效果**
   ```bash
   npm run dev
   ```
   - 访问 `http://localhost:8080` 预览

5. **构建生产版本**
   ```bash
   npm run build
   ```

---

## Front Matter 模板

```markdown
---
layout: layouts/blog-post.njk
title: "文章标题"
slug: "article-slug"
date: 2025-01-02
summary: "文章摘要（用于 SEO 和列表显示）"
category: "分类名称"
tags:
  - "post"
  - "标签1"
  - "标签2"
hero_image: "/assets/blog-drops/your-folder/hero-image.webp"
hero_alt: "图片描述"
author: "作者名称"
author_role: "作者职位"
read_time: "5 min read"
featured: false
lang: en
permalink: "/blog/{{ slug }}/index.html"
---

# 文章内容开始

直接写 Markdown 即可，排版会自动应用。
```

---

## 自定义组件

博客支持以下自定义组件（在 Markdown 中直接使用）：

### 高亮卡片
```html
<div class="highlight-card rounded-2xl p-6 border border-brand-accent/30 shadow-xl">
  <h2 class="text-xl font-bold text-white mb-3">标题</h2>
  <ul class="space-y-2 text-gray-200 list-disc list-inside">
    <li>列表项 1</li>
    <li>列表项 2</li>
  </ul>
</div>
```

### CTA 提示框
```html
<div class="callout rounded-2xl p-6 text-white space-y-3">
  <h3 class="text-xl font-bold">标题</h3>
  <p class="text-gray-100">描述文本</p>
  <a href="/contact/" class="bg-brand-accent hover:bg-brand-hover text-white font-bold px-4 py-3 rounded-lg transition">按钮文字</a>
</div>
```

### 图片框架
```html
<figure class="img-frame">
  <img src="/path/to/image.webp" alt="图片描述">
  <figcaption class="text-center text-gray-500 text-sm mt-3">图片说明</figcaption>
</figure>
```

---

## 排版效果示例

使用 Tailwind Typography 后，以下 Markdown 元素会自动美化：

- **标题** (h1-h6): 自动间距、大小、颜色
- **段落**: 自动行高、间距
- **列表**: 自动缩进、间距
- **表格**: 自动边框、斑马纹、响应式
- **引用**: 自动左边框、斜体样式
- **代码**: 自动背景色、圆角
- **链接**: 自动颜色、悬停效果
- **图片**: 自动居中、最大宽度
- **分隔线**: 自动样式、间距

---

## 常见问题

### Q: 为什么我的文章排版没有变化？

A: 请确保：
1. 已运行 `npm run build` 重新构建
2. 文章使用了正确的 layout: `layouts/blog-post.njk`
3. 内容包裹在 `<article class="prose prose-lg prose-invert max-w-none">` 中

### Q: 如何调整字体大小？

A: 在 `tailwind.config.js` 中配置 `prose-lg` 或使用其他变体：
- `prose-sm` - 更小
- `prose` - 默认
- `prose-lg` - 大（当前使用）
- `prose-xl` - 更大

### Q: 如何自定义颜色？

A: 在 `tailwind.config.js` 中扩展 Typography 配置：
```js
theme: {
  extend: {
    typography: (theme) => ({
      DEFAULT: {
        css: {
          color: theme('colors.gray.300'),
          a: {
            color: theme('colors.cyan.500'),
            '&:hover': {
              color: theme('colors.cyan.600'),
            },
          },
        },
      },
    }),
  },
}
```

---

## 技术支持

如有问题，请检查：
1. VSCode 扩展是否正确安装
2. Tailwind CSS 是否正确构建
3. 浏览器控制台是否有错误

更多配置选项请参考：
- [Tailwind Typography 文档](https://github.com/tailwindlabs/tailwindcss-typography)
- [Eleventy 文档](https://www.11ty.dev/docs/)
