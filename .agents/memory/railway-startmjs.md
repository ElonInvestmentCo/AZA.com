---
name: Railway start.mjs fix
description: Why start.mjs must use node_modules/next/dist/bin/next (not the .bin shim) to start Next.js on Railway.
---

# Railway start.mjs — Next.js binary path

## The rule
In `start.mjs`, the Next.js website process must be started as:
```js
run("web", "node", ["node_modules/next/dist/bin/next", "start"], { ... }, path.join(__dirname, "artifacts/website"));
```

**NOT** via the .bin shim:
```js
run("web", "node", ["./node_modules/.bin/next", "start"], ...);  // WRONG — shell script, not JS
```

**NOT** via the root node_modules:
```js
run("web", "node", ["../../node_modules/.bin/next", "start"], ...);  // WRONG — not hoisted
```

## Why
In Railway's pnpm container, `node_modules/.bin/next` is a `#!/bin/sh` shell script shim, NOT a JavaScript file. Passing it as an argument to `node` causes an immediate `SyntaxError: missing ) after argument list` crash on line 2 (`basedir=$(dirname ...)`). The real JS entry point is `node_modules/next/dist/bin/next` — always use that directly with `cwd` set to `artifacts/website`.

**Why:** `next` is NOT hoisted to the repo root `node_modules/.bin/` in pnpm monorepos. It only exists in the workspace's own `node_modules`. Using the root-relative path causes `MODULE_NOT_FOUND`; using the `.bin` shim causes `SyntaxError`. Both crash the container and make every Railway healthcheck fail.

## How to apply
Any time `start.mjs` is modified or the Next.js startup is reconfigured for Railway:
- Set `cwd` to `artifacts/website`
- Use `"node_modules/next/dist/bin/next"` as the path argument to `node`
- Never pass any `.bin/` shim script as a `node` argument — they are bash wrappers, not JS
