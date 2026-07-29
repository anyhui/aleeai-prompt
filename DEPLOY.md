# 部署指南

本项目是纯静态 Vite 应用，没有 API 后端、数据库、账号系统或服务端密钥存储。

## 构建

使用 Node.js 22：

```bash
npm ci
npm run check
```

`dist/` 可发布到静态主机。主机必须将未知应用路径回退到 `index.html`，并避免长期缓存 `index.html`；带内容哈希的 `/assets/` 可长期缓存。

不要通过 `.env`、CI 变量或 Docker build args 注入 API 密钥。Vite 构建变量属于公开客户端代码。用户在优化器界面输入自己的密钥，密钥只保留到当前页面会话结束。

## Docker

```bash
docker build -t aleeai-prompt .
docker run --rm -p 8080:80 aleeai-prompt
curl --fail http://127.0.0.1:8080/healthz
```

镜像使用 Node 22 构建并由 nginx 提供静态内容。仓库的 nginx 配置包含 CSP、`nosniff`、禁止 framing、严格 referrer/permissions policy、COOP、静态资源缓存和 `/healthz`。

## 生产 BYOK

浏览器直连适合知情用户使用自己的临时密钥。浏览器会把密钥和提示词直接发送到所选 OpenAI 兼容服务商，且目标服务必须允许该站点的 CORS 请求。

多人或公共生产站点应自行部署鉴权反向代理：在代理端保存服务商密钥、验证用户、限制请求并固定允许的上游。然后让用户在界面填写该代理的 HTTPS Chat Completions 兼容端点。本仓库没有提供该代理，也没有服务器端密钥、session、CORS 或 rate-limit 配置。

若需要连接本机开发服务，应用允许 `http://localhost:*`、`http://127.0.0.1:*` 和 IPv6 loopback。其他 HTTP、URL 内嵌用户名/密码及非 HTTP(S) 协议会被拒绝。
