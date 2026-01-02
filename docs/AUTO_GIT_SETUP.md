# 自动 Git 提交/推送配置指南

本指南介绍如何配置 VSCode 实现保存文件时自动提交并推送到 GitHub。

## 方案一：Auto Git Commit and Push（推荐，最简单）

### 1. 安装扩展

在 VSCode 中安装扩展：
- **扩展名称**: Auto Git Commit and Push
- **扩展 ID**: `YogeshValiya.autogitcommit`
- **链接**: https://marketplace.visualstudio.com/items?itemName=YogeshValiya.autogitcommit

### 2. 配置扩展

安装后，在 VSCode 设置中搜索 `autogitcommit`，配置以下选项：

```json
{
  "autogitcommit.enabled": true,
  "autogitcommit.commitMessage": "Auto commit: {{date}} {{time}}",
  "autogitcommit.pushAfterCommit": true,
  "autogitcommit.commitOnSave": true
}
```

### 3. 注意事项

- ⚠️ 此扩展会在每次保存文件时自动提交并推送
- 建议只在确认内容 OK 时启用此功能
- 避免把半成品代码推送到仓库

---

## 方案二：Run on Save（更灵活的控制）

### 1. 安装扩展

- **扩展名称**: Run on Save
- **扩展 ID**: `pucelle.run-on-save`
- **链接**: https://marketplace.visualstudio.com/items?itemName=pucelle.run-on-save

### 2. 配置扩展

在 VSCode 设置中添加以下配置：

```json
{
  "emeraldwalk.runonsave": {
    "commands": [
      {
        "match": "\\.(md|njk|html|js|css)$",
        "cmd": "git add ${file} && git commit -m 'Update ${fileBasename}' && git push",
        "isAsync": true
      }
    ]
  }
}
```

### 3. 注意事项

- 可以自定义 commit 消息
- 可以指定只对特定文件类型执行
- 更灵活但配置稍复杂

---

## 方案三：手动脚本（最安全）

创建一个简单的 npm 脚本，在需要时手动运行：

### 1. 在 `package.json` 中添加脚本

```json
{
  "scripts": {
    "commit-push": "git add . && git commit -m 'Update blog content' && git push"
  }
}
```

### 2. 使用方法

```bash
npm run commit-push
```

---

## 推荐工作流程

对于博客写作，推荐以下流程：

1. **写作阶段**: 使用 VSCode 编辑 Markdown 文件
2. **格式化**: 保存时自动格式化（已配置 Prettier + markdownlint）
3. **预览**: 运行 `npm run dev` 预览效果
4. **提交**: 确认无误后，手动运行 `npm run commit-push` 或启用自动提交

---

## 安全提示

⚠️ **重要**: 自动提交/自动推送类扩展只应安装来自可信来源、装机量高的扩展，并且不要授予不必要的权限。

最近确实出现过恶意 VSCode 扩展的安全案例，请务必注意安全。
