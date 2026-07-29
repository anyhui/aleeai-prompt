# Contributing

Use Node.js 22 and install the exact lockfile with `npm ci`.

Behavior changes should follow test-driven development: add a failing test, implement the smallest fix, then run:

```bash
npm run check
npm audit --omit=dev --audit-level=high
```

Do not add API keys, browser-persisted credentials, unverifiable performance claims, hardcoded model prices, or unsupported provider claims. Update security and deployment documentation when the browser/network boundary changes. Use focused conventional commits.
