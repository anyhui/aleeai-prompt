# Aleeai Prompt

一个静态 React 提示词工具，提供提示词库、本地结构化生成、编辑、复制和浏览器本地版本历史。远程 AI 优化是可选的 BYOK 功能。

## 功能

- 浏览和筛选 `public/agents.json` 中的角色提示词。
- 使用随应用发布的模板在浏览器本地生成、编辑和复制提示词。
- 在浏览器 `localStorage` 中保存提示词版本并比较历史。数据不上传，但同一浏览器环境下的其他脚本可能读取它。
- 可选地连接用户填写的 OpenAI Chat Completions 兼容端点进行流式优化。

模型名称和端点预设仅为可编辑示例，不代表可用性、兼容性、价格或服务质量保证。项目不提供模型账号、共享密钥或费用估算。

## BYOK 安全模型

- 默认构建不包含 API 密钥，也不读取 `VITE_API_KEY` 或 `VITE_DEFAULT_API_KEY`。
- 用户密钥只存在于当前优化器组件的 React 内存中，不写入源代码、构建环境、URL、日志、`localStorage` 或 `sessionStorage`；刷新或关闭页面后清除。
- 浏览器会把密钥和提示词直接发送给用户填写的服务商。服务商、浏览器扩展、同页脚本和被攻陷的静态站点仍可能看到密钥。
- 端点默认必须为 HTTPS。只有 `localhost`、`127.0.0.1` 和 `::1` 开发端点允许 HTTP；带 URL 凭据或非 HTTP(S) 协议的地址会被拒绝。
- 公共或生产部署建议使用自有鉴权反向代理，由代理安全保存服务商密钥并实施访问控制、限流和审计。本仓库不提供或假装提供后端。

本项目没有服务器端存储、用户账号、登录、跨设备同步、数据库、密钥托管、服务端限流或备份功能。

## 开发

需要 Node.js 22 和 npm。

```bash
npm ci
npm run dev
```

质量检查：

```bash
npm run check
npm audit --omit=dev --audit-level=high
```

构建产物可部署到任意支持 SPA fallback 的静态主机。Docker/nginx 部署见 [DEPLOY.md](DEPLOY.md)。安全问题报告见 [SECURITY.md](SECURITY.md)。

## 数据来源与许可

源代码采用 [MIT License](LICENSE)。`public/agents.json` 是第三方衍生数据，不能仅因本仓库采用 MIT 而被重新许可。现有仓库证据只表明它于 2025-02-24 随首次提交加入，并在旧 README 中注明来源为 Cherry Studio；没有保留确切上游提交或当时许可证。完整限制和校验信息见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。在来源许可核实前，重新分发者应自行评估并可替换该文件。
