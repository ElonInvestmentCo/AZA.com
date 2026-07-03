---
name: Railway start.mjs fix
description: Why start.mjs must use ./node_modules/.bin/next relative to artifacts/website, not ../../node_modules/.bin/next from the repo root.
---

# Railway start.mjs — Next.js binary path

## The rule
In `start.mjs`, the Next.js website process must be started as:
```js
run("web", "node", ["./node_modules/.bin/next", "start"], { ... }, path.join(__dirname, "artifacts/website"));
```

**NOT** the previous form:
```js
run("web", "node", ["../../node_modules/.bin/next", "start"], ...);  // WRONG
```

## Why
Railway uses pnpm with monorepo isolation. The `next` binary is NOT hoisted to the repo root `node_modules/.bin/` — it only exists in the workspace's own `node_modules/.bin/` (`artifacts/website/node_modules/.bin/next`). Using the root-relative path causes a fatal `MODULE_NOT_FOUND` crash at container startup, making every healthcheck fail.

## Next.js standalone mode — do NOT use
`output: "standalone"` in next.config.ts causes a Pages Router `<Html>` conflict during the static 404 page generation, failing the build. Standalone mode is not needed — the workspace binary approach works.

## How to apply
Any time `start.mjs` is modified or the Next.js startup is reconfigured for Railway, ensure the `cwd` is set to `artifacts/website` and the binary path is `./node_modules/.bin/next`.
