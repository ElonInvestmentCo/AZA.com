const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

/* ── pnpm monorepo: watch only the workspace lib packages mobile uses ─
   Watching the entire monorepoRoot would cause Metro to crawl all of
   root node_modules (~1000 packages) and stall. We target only the
   lib packages this app actually imports.                              */
const workspaceLibs = [
  path.resolve(monorepoRoot, "lib/api-client-react"),
  path.resolve(monorepoRoot, "lib/api-spec"),
  path.resolve(monorepoRoot, "lib/api-zod"),
  path.resolve(monorepoRoot, "lib/db"),
];
config.watchFolders = workspaceLibs.filter((p) => fs.existsSync(p));

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

/* ── pnpm stores real packages in .pnpm; enable symlink resolution ── */
config.resolver.unstable_enableSymlinks = true;

// Fix for pnpm + Metro: Metro's FallbackWatcher crashes when it tries to watch
// node_modules subdirectories inside pnpm packages that don't exist.
const originalWatch = fs.watch;
fs.watch = function (filename, options, listener) {
  try {
    return originalWatch(filename, options, listener);
  } catch (e) {
    if (e.code === "ENOENT") {
      return { close: () => {} };
    }
    throw e;
  }
};

/* ── Allow all hosts so Replit's proxy can reach the dev server ───── */
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
