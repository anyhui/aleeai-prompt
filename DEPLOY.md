# Aleeai-Prompt 部署指南

本文档提供了 Aleeai-Prompt AI提示词助手的详细部署说明，包括环境配置、安装步骤和常见问题解决方案。

## 目录

- [环境要求](#环境要求)
- [部署步骤](#部署步骤)
- [配置说明](#配置说明)
- [常见问题](#常见问题)

## 环境要求

### 基础环境
- Node.js 18.0+ (推荐使用 LTS 版本)
- npm 8.0+ 或 yarn 1.22+
- 现代浏览器（支持 ES6+）

### 系统要求
- CPU: 双核及以上
- 内存: 2GB 及以上
- 磁盘空间: 至少 500MB 可用空间
- 操作系统: Windows 10+/macOS 10.15+/Linux

## 部署步骤

### 1. 获取代码
```bash
# 克隆项目仓库
git clone [项目地址]
cd aleeai-prompt
```

### 2. 安装依赖
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 环境配置
1. 在项目根目录创建 .env 文件，配置必要的环境变量：
```env
# API 配置
VITE_API_ENDPOINT=你的API端点
VITE_DEFAULT_MODEL=gpt-4
VITE_API_KEY=你的API密钥
```

### 4. 开发与构建

#### 开发环境
```bash
# 启动开发服务器
npm run dev
```
开发服务器默认运行在 http://localhost:5173

#### 生产环境构建
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 5. 部署到生产环境

#### 使用 Nginx 部署
1. 将 dist 目录下的构建产物复制到网站根目录：
```bash
cp -r dist/* /var/www/html/
```

2. Nginx 配置示例：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存设置
    location /assets/ {
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }
}
```

## 常见问题

### 1. 构建失败
- 检查 Node.js 版本是否满足要求
- 清除 node_modules 并重新安装依赖
- 确保 .env 文件配置正确

### 2. API 连接失败
- 验证 API 密钥是否正确配置
- 检查 API 端点是否可访问
- 确认网络连接是否正常

### 3. 页面加载性能问题
- 确保启用了 Nginx 的 gzip 压缩
- 检查静态资源是否正确配置了缓存
- 考虑使用 CDN 加速静态资源加载

### 4. 路由刷新 404
- 确保 Nginx 配置了正确的 try_files 指令
- 检查是否所有路由都指向 index.html