# Aleeai-Prompt 部署指南

本文档提供了 Aleeai-Prompt AI提示词助手的详细部署说明，包括环境配置、安装步骤和常见问题解决方案。

## 目录

- [环境要求](#环境要求)
- [部署步骤](#部署步骤)
- [配置说明](#配置说明)
- [性能优化](#性能优化)
- [安全配置](#安全配置)
- [监控维护](#监控维护)
- [常见问题](#常见问题)

## 环境要求

### 基础环境
- Node.js 18.0+ (推荐使用 LTS 版本)
  - 建议使用 nvm 管理 Node.js 版本
  - Windows: 使用 nvm-windows
  - Linux/macOS: 使用 nvm
- npm 8.0+ 或 yarn 1.22+
  - 推荐使用 yarn，性能更好
- Git 2.0+
- 现代浏览器（支持 ES6+）
  - Chrome 90+
  - Firefox 90+
  - Safari 14+
  - Edge 90+

### 系统要求
- CPU: 双核及以上
  - 推荐 4核8线程
- 内存: 4GB 及以上
  - 推荐 8GB 以上用于开发环境
  - 生产环境根据并发量适当增加
- 磁盘空间: 
  - 系统盘: 10GB 以上可用空间
  - 数据盘: 根据数据量规划，建议预留 30% 冗余
- 操作系统: 
  - Windows 10/11 专业版及以上
  - macOS 10.15+
  - Ubuntu 20.04+ / CentOS 8+
- 网络要求:
  - 稳定的互联网连接
  - 建议带宽 ≥ 10Mbps

## 部署步骤

### 1. 准备工作

#### 安装 Node.js
```bash
# Windows 使用 nvm-windows
winget install nvm-windows
nvm install 18.19.0
nvm use 18.19.0

# Linux/macOS
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18.19.0
nvm use 18.19.0
```

#### 安装 Yarn
```bash
npm install -g yarn
```

### 2. 获取代码
```bash
# 克隆项目仓库
git clone [项目地址]
cd aleeai-prompt

# 如果使用 SSH 克隆（推荐）
git clone git@github.com:your-username/aleeai-prompt.git
```

### 3. 安装依赖
```bash
# 使用 yarn（推荐）
yarn install

# 或使用 npm
npm install

# 如果遇到网络问题，可以使用淘宝镜像
yarn config set registry https://registry.npmmirror.com
# 或
npm config set registry https://registry.npmmirror.com
```

### 4. 环境配置
1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. 编辑 .env 文件，配置必要的环境变量：
```env
# API 配置
VITE_API_ENDPOINT=你的API端点
VITE_DEFAULT_MODEL=gpt-4
VITE_API_KEY=你的API密钥

# 应用配置
VITE_APP_TITLE=Aleeai Prompt
VITE_APP_DESCRIPTION=AI提示词助手

# 性能配置
VITE_MAX_REQUESTS=100
VITE_RATE_LIMIT=60

# 安全配置
VITE_ENABLE_RATE_LIMIT=true
VITE_CORS_ORIGIN=*
```

### 5. 开发与构建

#### 开发环境
```bash
# 启动开发服务器
yarn dev
# 或
npm run dev
```
开发服务器默认运行在 http://localhost:5173

#### 生产环境构建
```bash
# 构建生产版本
yarn build

# 预览构建结果
yarn preview
```

### 6. 部署到生产环境

#### Docker 部署（推荐）
1. 构建 Docker 镜像：
```bash
docker build -t aleeai-prompt .
```

2. 运行容器：
```bash
docker run -d \
  -p 80:80 \
  -e VITE_API_ENDPOINT=你的API端点 \
  -e VITE_API_KEY=你的API密钥 \
  --name aleeai-prompt \
  aleeai-prompt
```

#### 使用 Nginx 部署
1. 将构建产物复制到网站根目录：
```bash
cp -r dist/* /var/www/html/
```

2. Nginx 配置示例：
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name tici.aleeai.com;
    root /www/wwwroot/tici.aleeai.com;
    index index.html;

    # 安全headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # SSL配置（推荐）
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 启用 gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 路由配置
    location / {
        try_files $uri $uri/ /index.html;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # API 代理配置
    location /api/ {
        proxy_pass http://api-backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存设置
    location /assets/ {
        expires 7d;
        add_header Cache-Control "public, no-transform";
        access_log off;
    }
}
```

## 性能优化

### 1. 前端优化
- 启用路由懒加载
- 使用 CDN 加速静态资源
- 图片懒加载和适当压缩
- 组件按需加载

### 2. 服务端优化
- 启用 HTTP/2
- 配置合理的缓存策略
- 使用负载均衡
- 开启 Gzip 压缩

### 3. 数据库优化
- 使用连接池
- 优化查询语句
- 合理设置索引
- 定期维护和优化

## 安全配置

### 1. 服务器安全
- 定期更新系统和依赖包
- 配置防火墙规则
- 使用 SSL/TLS 加密
- 实施访问控制

### 2. 应用安全
- 实施 Rate Limiting
- 配置 CORS 策略
- 使用安全的 Session 管理
- 防范 XSS 和 CSRF 攻击

## 监控维护

### 1. 性能监控
- 使用 New Relic 或 Datadog 监控应用性能
- 配置日志收集和分析
- 监控服务器资源使用情况

### 2. 错误追踪
- 使用 Sentry 进行错误追踪
- 配置错误报警机制
- 建立问题响应流程

### 3. 备份策略
- 定期备份数据
- 配置自动备份机制
- 测试恢复流程

## 常见问题

### 1. 构建失败
- 检查 Node.js 版本是否满足要求
  ```bash
  node -v
  ```
- 清除依赖并重新安装
  ```bash
  rm -rf node_modules
  yarn install
  ```
- 检查 .env 文件配置
  ```bash
  cat .env
  ```

### 2. API 连接失败
- 验证 API 密钥配置
  ```bash
  echo $VITE_API_KEY
  ```
- 检查 API 端点可访问性
  ```bash
  curl -I $VITE_API_ENDPOINT
  ```
- 检查网络连接和防火墙设置

### 3. 性能问题
- 检查并优化资源加载
  ```bash
  lighthouse http://your-domain.com
  ```
- 验证缓存配置
  ```bash
  curl -I http://your-domain.com
  ```
- 使用性能分析工具定位瓶颈

### 4. 部署后 404
- 检查 Nginx 配置
  ```bash
  nginx -t
  ```
- 确认构建文件位置正确
- 验证路由配置

### 5. 内存溢出
- 检查并调整 Node.js 内存限制
  ```bash
  export NODE_OPTIONS=--max-old-space-size=4096
  ```
- 优化大型操作的内存使用
- 考虑增加服务器内存

## 技术支持

如果遇到无法解决的问题，可以通过以下渠道获取支持：

1. 提交 Issue
2. 查阅官方文档
3. 加入技术支持群组
4. 联系技术支持团队

## 贡献指南

欢迎提交 Pull Request 或反馈建议，请确保：

1. 遵循代码规范
2. 编写测试用例
3. 更新相关文档
4. 提供清晰的提交信息

## 许可证

本项目采用 MIT 许可证，详见 LICENSE 文件。