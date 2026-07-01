const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// ─── Fix 1: pnpm FallbackWatcher ENOENT crash ────────────────────────────────
// Metro's FallbackWatcher calls fs.watch() on dirs that may not exist inside
// pnpm's virtual store, then immediately calls .on() on the returned object.
// We intercept ENOENT errors and return a full no-op EventEmitter-shaped stub.
const _fsWatch = fs.watch;
const noopWatcher = {
  close: () => {},
  on: () => noopWatcher,
  off: () => noopWatcher,
  addListener: () => noopWatcher,
  removeListener: () => noopWatcher,
  once: () => noopWatcher,
  emit: () => false,
};
fs.watch = function (filename, options, listener) {
  try {
    return _fsWatch.call(this, filename, options, listener);
  } catch (e) {
    if (e.code === "ENOENT") return noopWatcher;
    throw e;
  }
};

// ─── Fix 2: pnpm monorepo module resolution ───────────────────────────────────
// Without this, Metro only looks in artifacts/mobile/node_modules and misses
// packages hoisted to the workspace root — including expo-router/entry.
config.watchFolders = [monorepoRoot];
config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(monorepoRoot, "node_modules"),
  ],
};

// ─── Fix 3: Allow Replit's proxy to reach Metro ───────────────────────────────
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
