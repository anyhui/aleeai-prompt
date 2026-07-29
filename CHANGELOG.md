# Changelog

All notable changes are documented here. The project does not currently publish tagged releases.

## Unreleased

- Removed all build-time/browser-bundled API key configuration and legacy key compatibility.
- Added session-only BYOK guidance, strict endpoint validation, request timeouts, sanitized errors, and chunk-safe streaming.
- Preserved local prompt browsing, generation, editing, copying, and version history.
- Removed unverified performance, pricing, provider, and platform claims.
- Upgraded the Node.js 22 toolchain and dependency graph; added security-focused tests and CI audit checks.
- Hardened the nginx static deployment and added a health endpoint.
