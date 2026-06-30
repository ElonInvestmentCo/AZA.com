---
name: Metro pnpm monorepo fix
description: Required metro.config.js changes to resolve expo-router/entry in a pnpm workspace and prevent FallbackWatcher crashes.
---

## The rule
`artifacts/mobile/metro.config.js` must include three patches to work in the Replit pnpm monorepo.

## Fix 1 — FallbackWatcher ENOENT crash
Metro's FallbackWatcher calls `fs.watch()` on dirs that may not exist in pnpm's virtual store, then immediately calls `.on()` on the returned object. Intercept ENOENT and return a **full no-op stub** — a bare `{ close }` breaks because FallbackWatcher also calls `.on()`, `.addListener()`, etc.

```js
const noopWatcher = {
  close: () => {},
  on: () => noopWatcher,
  off: () => noopWatcher,
  addListener: () => noopWatcher,
  removeListener: () => noopWatcher,
  once: () => noopWatcher,
  emit: () => false,
};
fs.watch = function(filename, options, listener) {
  try { return _fsWatch.call(this, filename, options, listener); }
  catch (e) { if (e.code === 'ENOENT') return noopWatcher; throw e; }
};
```

## Fix 2 — pnpm monorepo module resolution
Without this, Metro can't find packages hoisted to the monorepo root (including expo-router/entry itself).

```js
const monorepoRoot = path.resolve(__dirname, '../..');
config.watchFolders = [monorepoRoot];
config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [
    path.resolve(__dirname, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
  ],
};
```

## Fix 3 — Replit proxy CORS
```js
config.server = { ...config.server, enhanceMiddleware: (m) => (req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','*'); return m(req,res,next);
}};
```

**Why:** pnpm uses symlinks; Metro's default resolver and watcher don't follow them across the monorepo boundary without explicit configuration.

**How to apply:** Any time metro.config.js is regenerated or overwritten (e.g. from a git sync), reapply all three fixes before restarting Expo.
