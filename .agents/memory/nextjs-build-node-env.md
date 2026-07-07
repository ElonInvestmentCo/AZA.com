---
name: Next.js build NODE_ENV fix
description: Why NODE_ENV=production must be hardcoded in the Next.js build script, not left to the host environment.
---

# Next.js build must force NODE_ENV=production

## The rule
The `build` script in `artifacts/website/package.json` must be:
```
"build": "NODE_ENV=production next build"
```
Never remove this prefix.

## Why
Next.js 15.5.x (and likely later) performs a runtime context check inside the `<Html>` component from `next/document`. During `next build`, Next.js statically pre-renders all pages including the pages-router fallback `/404`. If `NODE_ENV` is not `'production'` at the time of that pre-render, the `useHtmlContext()` check inside `Html` receives the wrong context and throws:

> Error: `<Html>` should not be imported outside of pages/_document.
> Export encountered an error on /_error: /404, exiting the build.

In the Replit dev environment, `NODE_ENV=development` is set at the OS level. Next.js tries to set it to `production` internally during the build, but a pre-existing env var at the OS level takes precedence in Node.js. This causes the crash — and the production Railway deployment serves an "Internal Server Error" because the build never succeeds.

## How to apply
- Never remove the `NODE_ENV=production` prefix from the build script.
- This is safe: the dev server uses `next dev` (separate script), not `next build`, so dev hot-reload is unaffected.
- On Railway, `NODE_ENV=production` should ALSO be set as an env var for the runtime process (needed for CORS logic in the API server), but that alone is not sufficient for the build step because the build step inherits the shell environment.
- On Windows, the `NODE_ENV=production` inline prefix won't work — use `cross-env` if Windows support is ever needed.
