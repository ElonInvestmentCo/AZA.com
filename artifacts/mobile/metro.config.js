const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// ────────────────────────────────────────────────────────────────
// Fix 1: pnpm FallbackWatcher ENOENT crash
// ────────────────────────────────────────────────────────────────
const originalFsWatch = fs.watch;

const noopWatcher = {
  close: () => {},
  on: () => noopWatcher,
  off: () => noopWatcher,
  once: () => noopWatcher,
  emit: () => false,
  addListener: () => noopWatcher,
  removeListener: () => noopWatcher,
};

fs.watch = function (filename, options, listener) {
  try {
    return originalFsWatch.call(this, filename, options, listener);
  } catch (error) {
    if (error.code === "ENOENT") {
      return noopWatcher;
    }
    throw error;
  }
};

// ────────────────────────────────────────────────────────────────
// Fix 2: pnpm monorepo support
// Keep Expo defaults and ADD the workspace root.
// ────────────────────────────────────────────────────────────────
config.watchFolders = [
  ...(config.watchFolders || []),
  monorepoRoot,
];

config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [
    path.join(projectRoot, "node_modules"),
    path.join(monorepoRoot, "node_modules"),
  ],
};

// ────────────────────────────────────────────────────────────────
// Fix 3: Replit CORS support
// ────────────────────────────────────────────────────────────────
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
