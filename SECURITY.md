# Security Policy

## Supported Version

Security fixes are made on the default branch. No historical release line is currently maintained.

## Reporting

Please use GitHub private vulnerability reporting when available. Otherwise, open an issue that asks maintainers for a private contact channel without including secrets, working exploits, personal data, or provider response bodies.

Never submit API keys. If a key may have been exposed, revoke it at the provider before reporting.

## Scope

This repository ships a static browser application. It has no server-side account, storage, synchronization, proxy, or secret-management service. BYOK credentials are held only in React memory and sent directly to the endpoint selected by the user. See `README.md` for the threat model.
